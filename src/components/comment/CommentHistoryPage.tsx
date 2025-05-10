import { Typography, Stack, Skeleton, Box, Avatar, Card, styled, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import EmptyState from "../emptyState/EmptyState";
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteComment, fetchUserComments } from "../../api/comments";
import { StoryCommentData } from "../../types/story";
import CommentBlock from "./CommentBlock";
import { useNavigate } from "react-router-dom";

const HistoryCommentCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }
}));

export default function CommentHistoryPage() {
  const [comments, setComments] = useState<StoryCommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserComments()
      .then((res) => setComments(res.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        height={100}
        width="100%"
        sx={{ borderRadius: 1 }}
      />
    ));
  };

  const handleCommentDelete = async (event: React.MouseEvent<HTMLElement>, commentId: number) => {
    event.stopPropagation();
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography variant="h4" sx={{ textAlign: "center" }} gutterBottom>
        Your Comments
      </Typography>

      <Stack gap={1} width="100%">
        {loading ? (
          renderSkeletons(4)
        ) : comments.length === 0 ? (
          <EmptyState
            title="No Comments Yet"
            message="You haven't posted any comments yet."
            Icon={CommentIcon}
          />
        ) : (
          comments.map(comment => 
            <HistoryCommentCard onClick={() => navigate(`/story/${comment.story?.id}`)}>
              <Stack gap={1} direction="row">
                <Avatar src={comment.story?.coverImageUrl}>{comment.story?.title[0]}</Avatar>
                <Typography variant="h6">{comment.story?.title}</Typography>
                <IconButton 
                  size="large"
                  aria-label="open drawer"
                  sx={{ height: 40, width: 40, marginLeft: 'auto'}}
                  title="delete comment"
                  onClick={(event) => handleCommentDelete(event, comment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <Box sx={{ml: 6}}>
                <CommentBlock key={comment.id} comment={comment} showAvatar={false} />
              </Box>
            </HistoryCommentCard>)
        )}
      </Stack>
    </Box>
  );
}