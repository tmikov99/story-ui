import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { getTimeAgo } from "../../utils/formatDate";
import { StoryCommentData } from "../../types/story";
import { stringToHslColor } from "../../utils/userColors";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

interface CommentBlockProps {
  comment: StoryCommentData;
  showAvatar?: boolean;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}

export default function CommentBlock({ comment, showAvatar = true, showDelete = false, onDelete }:CommentBlockProps) {
  const navigate = useNavigate();
  return (
    <Box gap={2} sx={{display: "flex"}}>
      {showAvatar && 
        <Avatar 
          sx={{ bgcolor: stringToHslColor(comment.username) }} 
          src={comment.imageUrl}
        >
            {comment.username[0]}
        </Avatar>
      }
      <Stack width='100%'>
        <Box gap={1} sx={{display: "flex"}}>
          <Typography 
            variant="body2" 
            {...(showAvatar && {
              sx: { cursor: "pointer" },
              onClick: () => navigate(`/user/${comment.username}`)
            })}
          >
            {comment.username}
          </Typography>
          <Typography variant="caption" sx={(theme) => ({color: theme.palette.text.secondary})}>
            {getTimeAgo(comment.createdAt)}
          </Typography>
          {showDelete && onDelete &&
            <IconButton size="small"
              aria-label="open drawer"
              sx={{width: '24px', height: '24px', margin: 'auto', marginRight: 1}}
              title="delete comment"
              onClick={() => onDelete(comment.id)}
            >
              <DeleteIcon />
            </IconButton>
          }
        </Box>
        <Typography variant="body2">{comment.text}</Typography>
      </Stack>
    </Box>
  );
}