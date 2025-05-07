import { Avatar, Box, Stack, Typography } from "@mui/material";
import { getTimeAgo } from "../../utils/formatDate";
import { StoryCommentData } from "../../types/story";
import { stringToHslColor } from "../../utils/userColors";

interface CommentBlockProps {
  comment: StoryCommentData;
  showAvatar?: boolean;
}

export default function CommentBlock({ comment, showAvatar = true }:CommentBlockProps) {
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
      <Stack>
        <Box gap={1} sx={{display: "flex"}}>
          <Typography variant="body2">{comment.username}</Typography>
          <Typography variant="caption" sx={(theme) => ({color: theme.palette.text.secondary})}>
            {getTimeAgo(comment.createdAt)}
          </Typography>
        </Box>
        <Typography variant="body2">{comment.text}</Typography>
      </Stack>
    </Box>
  );
}