import { Typography, Stack, Skeleton, Box, Avatar, Card, styled, IconButton, Pagination } from "@mui/material";
import { useState, useEffect } from "react";
import EmptyState from "../emptyState/EmptyState";
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteComment, fetchUserComments } from "../../api/comments";
import { StoryCommentData } from "../../types/story";
import CommentBlock from "./CommentBlock";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/snackbarSlice";
import { useConfirmDialog } from "../../hooks/ConfirmDialogProvider";

const HistoryCommentCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }
}));

const PAGE_SIZE = 10;

export default function CommentHistoryPage() {
  const [comments, setComments] = useState<StoryCommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = pageParam - 1;
  const { showConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchUserComments({ page, size: PAGE_SIZE })
      .then((res) => {
        if (res.totalPages > 0 && page >= res.totalPages) {
          setSearchParams({ page: '1' });
          return;
        }
        setComments(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        dispatch(showSnackbar({ message: "Request failed. Please try again.", severity: "error" }));
      })
      .finally(() => setLoading(false));
  }, [page]);

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
    showConfirm({title: "Delete comment", message: "Delete your comment permanently?"}, async () => {
      try {
        await deleteComment(commentId);
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        dispatch(showSnackbar({ message: "Comment deleted.", severity: "success" }));
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to delete comment.", severity: "error" }));
      }
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value.toString() });
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
      {!loading && comments.length > 0 && totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            siblingCount={2}
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}