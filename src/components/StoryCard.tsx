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
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StoryData } from '../types/story';
import { formatDateString } from '../utils/formatDate';
import { toggleFavorite, toggleLike } from '../api/story';
import { useEffect, useState } from 'react';

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

interface StoryCardProps {
  storyData: StoryData;
  onClick?: (story: StoryData) => void;
  showActions?: boolean;
}

export default function StoryCard({ storyData, onClick, showActions = true }: StoryCardProps) {
  const [story, setStory] = useState(storyData);

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
  };

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const result = await toggleFavorite(story.id);
    setStory(prev => ({ ...prev, favorite: result }));
  };

  const handleLikeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const response = await toggleLike(story.id);
    setStory(prev => ({ ...prev, liked: response.result, likes: response.likes }));
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <SyledCard sx={{}} onClick={handleCardClick}>
      <CardHeader
        sx={{paddingLeft: 2, paddingTop: 2, paddingRight: 2}}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} onClick={handleAvatarClick} aria-label="recipe">
            {story.user.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton onClick={handleOptionsClick} aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={story.title}
        subheader={formatDateString(story.createdAt)}
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
      </SyledCardContent>
      {showActions && <CardActions disableSpacing sx={{paddingLeft: 2, paddingRight: 2, paddingBottom: 2}}>
        <IconButton onClick={handleFavoriteClick} aria-label="add to favorites">
          {story.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton onClick={handleLikeClick} aria-label="share">
          {story.liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
        </IconButton>
        {story.likes}
      </CardActions>}
    </SyledCard>
  );
}