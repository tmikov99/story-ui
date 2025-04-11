import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StoryData } from '../types/story';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));


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
    maxHeight: '6em',
    lineHeight: '1.5em'
  }));

interface StoryCardProps {
  story: StoryData;
  onClick?: (story: StoryData) => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(story);
    }
  }

  const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
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
        subheader="September 14, 2016" //TODO: manage dates
      />
      <CardMedia
        component="img"
        height="194"
        image="/assets/default-history-fiction.jpg"
        alt="Paella dish"
      />
      <SyledCardContent>
        <StyledTypography variant="body2">
          {story.description}
        </StyledTypography>
      </SyledCardContent>
      <CardActions disableSpacing sx={{paddingLeft: 2, paddingRight: 2, paddingBottom: 2}}>
        <IconButton onClick={handleFavoriteClick} aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={handleShareClick} aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </SyledCard>
  );
}