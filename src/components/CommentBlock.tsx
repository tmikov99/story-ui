import { Avatar, Box, Stack, Typography } from "@mui/material";
import { StoryCommentData } from "../types/story";
import { getTimeAgo } from "../utils/formatDate";

interface CommentBlockProps {
  comment: StoryCommentData;
}

export default function CommentBlock({ comment }:CommentBlockProps) {
  return (
    <Box gap={2} sx={{display: "flex"}}>
      <Avatar src={comment.imageUrl}>{comment.username[0]}</Avatar>
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