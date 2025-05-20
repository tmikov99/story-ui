import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { archiveStory, copyStoryDraft, createComment, deleteStory, fetchComments, fetchStory, publishStory } from '../../api/story';
import { StoryCommentData, StoryData } from '../../types/story';
import { useUserPlaythrough } from '../../hooks/useUserPlaythrough';
import { formatDateString, getTimeAgo } from '../../utils/formatDate';
import { Avatar, Button, ButtonGroup, Chip, Paper, Skeleton, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CommentBlock from '../comment/CommentBlock';
import { stringToHslColor } from '../../utils/userColors';
import { deleteComment } from '../../api/comments';
import { loadPlaythrough } from '../../api/playthrough';
import { ValidationErrorResponse } from '../../types/validations';
import { getGenreLabel } from '../../utils/genreUtil';
import { showSnackbar } from '../../redux/snackbarSlice';
import { useConfirmDialog } from '../../hooks/ConfirmDialogProvider';

const PAGE_SIZE = 10;

export default function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storyId = Number(id)
  const [story, setStory] = useState<StoryData | null>(null);
  const [comments, setComments] = useState<StoryCommentData[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const [commentText, setCommentText] = useState<string>("");
  const [commentFocus, setCommentFocus] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);
  const { showConfirm } = useConfirmDialog();
  const isDraft = story?.status === "DRAFT";
  
  if (!id) {
    return(<div>ERROR</div>)
  }

  const { 
    currentPlaythrough,
    playthroughs,
    startNewPlaythrough,
    removePlaythrough,
  } = useUserPlaythrough(storyId);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const data = await fetchStory(storyId);
        setStory(data);
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to fetch story.", severity: "error" }));
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [id])

  const loadCommentsPage = async (pageNum: number) => {
    try {
      const res = await fetchComments(storyId, pageNum, PAGE_SIZE);
      if (pageNum === 0) {
        setComments(res.content);
      } else {
        setComments(prev => [...prev, ...res.content]);
      }
      setHasMoreComments(!res.last);
    } catch (error) {
      dispatch(showSnackbar({ message: "Error fetching comments.", severity: "error" }));
    }
  };

  useEffect(() => {
    if (id) {
      loadCommentsPage(0);
    }
  }, [id]);

  const loadMoreComments = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadCommentsPage(nextPage);
  };

  const askConfirmation = (message: string, action: () => void) => {
    showConfirm({ message }, action);
  };

  const handleStartNewPlaythrough = async () => {
    const newPlay = await startNewPlaythrough();
    if (newPlay) {
      navigate(`/playthrough/${newPlay.id}`);
    }
  };

  const handleEditStory = () => {
    if (!story) {
      console.log("Missing Story Error")
      return;
    }
    navigate(`/edit/${id}`);
  }

  const handleCreateDraft = async () => {
    if (!story) {
      console.log("Missing Story Error")
      return;
    }
    askConfirmation("Create draft? Story properties and pages will be copied to a separate new story draft.", async () => {
      try {
        const newStory = await copyStoryDraft(story.id);
        navigate(`/story/${newStory.id}`);
        dispatch(showSnackbar({ message: "Draft created.", severity: "success" }));
      } catch (err) {
        dispatch(showSnackbar({ message: "Failed to create draft.", severity: "error" }));
      }
    });
  }

  const handleEditPages = () => {
    if (!story) {
      console.log("Missing Story Error")
      return;
    }
    navigate(`/pageLinks/${id}`);
  }

  const handleDeleteStory = () => {
    if (!story) return;
    askConfirmation("Are you sure you want to delete this story? This action cannot be undone.", async () => {
      try {
        await deleteStory(story.id);
        dispatch(showSnackbar({ message: "Story deleted.", severity: "success" }));
        navigate("/created");
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to delete story.", severity: "error" }));
      }
    });
  };

  const handleCommentFocus = () => {
    if (!commentFocus) {
      setCommentFocus(true);
    }
  }

  const unfocusComment = () => {
    setCommentText("");
    setCommentFocus(false);
  }

  const handleCommentSend = async () => {
    try {
      const newComment = await createComment(storyId, commentText);
      setComments([newComment, ...comments]);
      unfocusComment();
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to send comment.", severity: "error" }));
    }
  }

  const handleCommentDelete = async (commentId: number) => {
    askConfirmation("Delete comment? It will be permanently deleted.", async () => {
      try {
        await deleteComment(commentId);
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        dispatch(showSnackbar({ message: "Comment deleted.", severity: "success" }));
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to delete comment.", severity: "error" }));
      }
    });
  };

  const handleArchive = () => {
    askConfirmation("Archive this story? It will be hidden from public view.", async () => {
      try {
        const archiveResponse = await archiveStory(storyId);
        setStory(archiveResponse);
        dispatch(showSnackbar({ message: "Story archived.", severity: "success" }));
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to archive story.", severity: "error" }));
      }
    });
  };

const handlePublish = async () => {
  askConfirmation("Publish this story? It will be publicly visible.", async () => {
    try {
      const publishResponse = await publishStory(storyId);
      setStory(publishResponse);
      setValidationErrors(null);
      dispatch(showSnackbar({ message: "Story published.", severity: "success" }));
    } catch (error: any) {
      const errData = error?.response?.data as ValidationErrorResponse;
      if (error?.response?.status === 400 && errData?.errors) {
        setValidationErrors(errData.errors);
      } else {
        dispatch(showSnackbar({ message: "Failed to publish story.", severity: "error" }));
      }
    }
  });
};

  const handleLoadPlaythrough = (playthroughId: number | undefined) => {
    if (!playthroughId) {
      console.log("Missing playthrough id!");
      return;
    }
    loadPlaythrough(playthroughId)
      .then(() => navigate(`/playthrough/${playthroughId}`))
      .catch(() => dispatch(showSnackbar({ message: "Failed to load playthrough.", severity: "error" })));
  }

  const handleCoverImgClick = () => {
    if (!currentPlaythrough) {
      handleStartNewPlaythrough();
    } else {
      handleLoadPlaythrough(currentPlaythrough.id);
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Story Overview
      </Typography>
      {loading ? 
        (
          <Grid
            container
            spacing={2}
            columns={12}
          >
            <Grid size={{ xs: 12, lg: 6 }}>
              <Skeleton variant="rectangular" height={450} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack gap={1}>
                <Skeleton variant="rectangular" height={46}/>
                <Skeleton variant="rectangular" height={26}/>
                <Skeleton variant="rectangular" height={20}/>
                <Skeleton variant="rectangular" height={20}/>
                <Skeleton variant="rectangular" height={20}/>
                <Skeleton variant="rectangular" height={20}/>
                <Skeleton variant="rectangular" height={250} />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            columns={12}
            marginBottom={2}
          >
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box         
                onClick={handleCoverImgClick}
                sx={{
                  position: "relative",
                  '&:hover .startText': {
                      opacity: 1,
                      cursor: 'pointer',
                  },
                  '&:hover img': {
                      cursor: 'pointer',
                      opacity: '0.7',
                  }
                }}
              >
                <Box
                    component="img"
                    sx={{
                        width: '100%',
                        transition: '0.3s',
                    }}
                    src={story?.coverImageUrl}
                />
                <Typography className="startText" variant='h3' sx={{
                    position: "absolute",
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%);',
                    padding: 2,
                    opacity: 0,
                    transition: '0.3s',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white!important',
                }}>
                    {currentPlaythrough ? `Continue Reading` : `Start Reading`}
                </Typography>
              </Box>
              {user && (
                <Stack spacing={1}>
                  {currentPlaythrough && (
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleLoadPlaythrough(currentPlaythrough.id)}
                    >
                      Continue Playthrough
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartNewPlaythrough}
                  >
                    Start New Playthrough
                  </Button>

                </Stack>
              )}
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack>
                {user?.username === story?.user.username && 
                  <>
                    <ButtonGroup aria-label="Basic button group" sx={{marginBottom: 1}}>
                      <Button 
                        color='secondary' 
                        onClick={isDraft ? handleEditStory : handleCreateDraft}>
                        {isDraft ? "Edit Properties" : "Create Draft"}
                      </Button> 
                      {isDraft && 
                        <Button color='secondary'onClick={handleEditPages}>
                          Edit Pages
                        </Button>
                      }
                      <Button color='error' onClick={handleDeleteStory}>Delete Story</Button>
                    </ButtonGroup>
                    {validationErrors && validationErrors.length > 0 && (
                      <Box mb={2}>
                        <Paper variant="outlined" sx={{padding: 2}}>
                          <Typography variant="subtitle1" color="warning">
                            Cannot publish story due to the following validation issues:
                          </Typography>
                            {validationErrors.map((err, i) => (
                                <Typography variant="body2" fontWeight="bold" color="warning" key={i}>
                                  {err}
                                </Typography>
                            ))}
                        </Paper>
                      </Box>
                    )}
                    <Stack direction="row" gap={1} sx={{alignItems: "center"}}>
                      <Typography>Status: {story?.status}</Typography>
                      {story?.status === "PUBLISHED" 
                        ? <Button variant="contained" onClick={handleArchive}>ARCHIVE</Button> 
                        : <Button variant="contained" onClick={handlePublish}>PUBLISH</Button>
                      }
                    </Stack>
                  </>
                }
                <Typography variant='h4'>{story?.title}</Typography>
                <Typography variant='h6'>By: {story?.user.username}</Typography>
                <Typography>Pages: {story?.pageCount}</Typography>
                <Typography>Created: {formatDateString(story?.createdAt)}</Typography>
                <Stack direction="row" gap={0.5} sx={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                  <Typography>Genres:&nbsp;</Typography>
                  {story?.genres.map(genre => <Chip variant="outlined" label={getGenreLabel(genre)} key={genre} />)}
                </Stack>
                <Stack direction="row" gap={0.5} sx={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                  <Typography>Tags:&nbsp;</Typography>
                  {story?.tags.map(tag => <Chip variant="outlined" label={tag} key={tag} />)}
                </Stack>
                <Typography>Description: {story?.description}
                </Typography>
              </Stack>
            </Grid>
            {playthroughs.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography variant="h6">Load Saved Playthrough</Typography>
                  <Stack spacing={1}>
                    {playthroughs.map(p => (
                      <Stack 
                        key={p.id} 
                        direction="row"
                        spacing={2}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Paper
                          variant="outlined"
                          sx={(theme) => ({
                            padding: 1,
                            borderLeft: p.completed ? `6px solid ${theme.palette.success.main}` : undefined,
                            backgroundColor: p.completed
                              ? theme.palette.success.light
                              : theme.palette.background.paper,
                            opacity: p.completed ? 0.8 : 1,
                            flexGrow: 1,
                          })}
                        >
                          <Typography variant="body1">
                            {p.completed ? '✔ Completed' : '🕓 In Progress'} (Page: {p.currentPage}) - Started: {getTimeAgo(p.startedAt)} {p.active && ' (Current)'}
                          </Typography>
                        </Paper>
                        <Stack direction="row" gap={1}>
                          <Button 
                            variant='contained'
                            onClick={() => handleLoadPlaythrough(p.id)}
                          >
                            Load
                          </Button>
                          <Button 
                            color="error"
                            variant='outlined'
                            onClick={() => removePlaythrough(p.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </Typography>
      <Stack gap={2}>
        <Box>
          <Box gap={2} sx={{display: "flex"}}>
            <Avatar 
              src={user?.imageUrl}
              sx={{ bgcolor: stringToHslColor(user?.username) }}
            >
              {user?.username[0]}
            </Avatar>
            <TextField 
              multiline fullWidth variant='standard' 
              placeholder='Add a comment...' 
              onFocus={handleCommentFocus}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Box>
          {commentFocus && <Box sx={{float: "inline-end"}}>
            <Button sx={{marginRight: "1rem"}} onClick={unfocusComment}>Cancel</Button>
            <Button variant='outlined' disabled={!commentText.length} onClick={handleCommentSend}>Comment</Button>
          </Box>}
        </Box>
        {loading ? 
          (
            <Skeleton variant='rectangular' height={52} />
          ) : (
            <>
              {comments.map(comment => (
                <CommentBlock 
                  key={comment.id} 
                  comment={comment} 
                  showDelete={user?.username === comment.username}
                  onDelete={handleCommentDelete}
                />
              ))}
              {hasMoreComments && (
                <Button variant="outlined" onClick={loadMoreComments}>
                  Load More Comments
                </Button>
              )}
            </>
          )
        }
      </Stack>
    </Box>
  );
}