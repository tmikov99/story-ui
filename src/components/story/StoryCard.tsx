import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { StoryData } from '../../types/story';
import { getTimeAgo } from '../../utils/formatDate';
import { publishStory, toggleFavorite, toggleLike } from '../../api/story';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatStoryReads } from '../../utils/formatStory';
import { Box, Button, Chip, Stack } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';
import { stringToHslColor } from '../../utils/userColors';
import { getGenreLabel } from '../../utils/genreUtil';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../redux/snackbarSlice';
import { useConfirmDialog } from '../../hooks/ConfirmDialogProvider';

const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '&:focus-visible': {
      outline: '3px solid',
      outlineColor: 'hsla(210, 98%, 48%, 0.5)',
      outlineOffset: '2px',
    },
  }));
  
  const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingLeft: 16,
    paddingRight: 16,
    flexGrow: 1,
    '&:last-child': {
      paddingBottom: 16,
    },
  });
  
  const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '6em',
    lineHeight: '1.5em'
  }));

  const TruncatedTitle = styled(Typography)({
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

interface StoryCardProps {
  storyData: StoryData;
  onClick?: (story: StoryData) => void;
}

export default function StoryCard({ storyData, onClick }: StoryCardProps) {
  const [story, setStory] = useState(storyData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirm } = useConfirmDialog();

  useEffect(() => {
    setStory(storyData);
  }, [storyData]);

  const handleCardClick = () => {
    if (onClick) {
      onClick(story);
    }
  }

  const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    navigate(`/user/${story.user.username}`);
  };

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      const result = await toggleFavorite(story.id);
      setStory(prev => ({ ...prev, favorite: result }));
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to toggle favorite.", severity: "error" }));
    }
  };

  const handleLikeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      const response = await toggleLike(story.id);
      setStory(prev => ({ ...prev, liked: response.result, likes: response.likes }));
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to toggle like.", severity: "error" }));
    }
  };

  //TODO: Decide if menu is needed
  // const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  // };

  const handlePublish = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    showConfirm({title: "Publish story", message: "Make story publicly visible?"}, async () => {
      try {
        const publishResponse = await publishStory(story.id);
        setStory(publishResponse);
        dispatch(showSnackbar({ message: "Story published.", severity: "success" }));
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to publish story.", severity: "error" }));
      }
    });
  }

  return (
    <SyledCard sx={{}} onClick={handleCardClick}>
      <CardHeader
        sx={{
          paddingLeft: 2, 
          paddingTop: 2, 
          paddingRight: 2, 
          '& .MuiCardHeader-content': {
            minWidth: 0,
          },
        }}
        avatar={
          <Avatar 
            sx={{ bgcolor: stringToHslColor(story.user.username) }} 
            src={story.user?.imageUrl} 
            onClick={handleAvatarClick} 
            aria-label="user"
          >
            {story.user.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        //TODO: Decide if menu is needed
        // action={
        //   <IconButton onClick={handleOptionsClick} aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={
          <TruncatedTitle title={story.title}>
            {story.title}
          </TruncatedTitle>
        }
        subheader={`${formatStoryReads(story.reads)} • ${getTimeAgo(story.createdAt)}`}
      />
      <CardMedia
        component="img"
        height="194"
        image={story.coverImageUrl || "/assets/default-history-fiction.jpg"}
        alt="Paella dish"
      />
      <SyledCardContent>
        <StyledTypography variant="body2">
          {story.description}
        </StyledTypography>
        {story.genres && story.genres.length > 0 && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mt={1}>
            {story.genres.map((genre) => (
              <Chip
                key={genre}
                label={getGenreLabel(genre)}
              />
            ))}
          </Stack>
        )}
      </SyledCardContent>
      <CardActions disableSpacing sx={{paddingLeft: 2, paddingRight: 2, paddingBottom: 2}}>
        {story.status ==="DRAFT" 
          ? <Box sx={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
              <Box gap={1} sx={{display: 'flex'}}>
                <ModeIcon />
                <Typography>DRAFT</Typography>
              </Box>
              <Button variant='contained' onClick={handlePublish}>PUBLISH</Button>
            </Box>
          : <>
            <IconButton onClick={handleFavoriteClick} aria-label="add to favorites">
              {story.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={handleLikeClick} aria-label="share">
              {story.liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
            </IconButton>
            {story.likes}
          </>
        }
      </CardActions>
    </SyledCard>
  );
}