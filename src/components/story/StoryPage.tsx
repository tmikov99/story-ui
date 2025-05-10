import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { archiveStory, createComment, deleteStory, fetchComments, fetchStory, publishStory } from '../../api/story';
import { StoryCommentData, StoryData } from '../../types/story';
import { useUserPlaythrough } from '../../hooks/useUserPlaythrough';
import { formatDateString } from '../../utils/formatDate';
import { Avatar, Button, ButtonGroup, Chip, Skeleton, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CommentBlock from '../comment/CommentBlock';
import { stringToHslColor } from '../../utils/userColors';
import { deleteComment } from '../../api/comments';
import { loadPlaythrough } from '../../api/playthrough';

export default function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storyId = Number(id)
  const [story, setStory] = useState<StoryData | null>(null);
  const [comments, setComments] = useState<StoryCommentData[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const [commentText, setCommentText] = useState<string>("");
  const [commentFocus, setCommentFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  if (!id) {
    return(<div>ERROR</div>)
  }

  const { 
    currentPlaythrough,
    playthroughs,
    startNewPlaythrough,
  } = useUserPlaythrough(storyId);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const data = await fetchStory(storyId);
        const commentsData = await fetchComments(storyId);
        setStory(data);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [id])

  // const handleStartPlaythrough = () => {
  //   if (!story) {
  //     console.log("Missing Story Error")
  //     return;
  //   }
  //   if (!playthrough) {
  //     savePage(story.startPage)
  //     navigate(`/story/${id}/page/${story.startPage}`);
  //   } else {
  //     navigate(`/story/${id}/page/${playthrough.currentPage}`);
  //   }
  // }

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

  const handleEditPages = () => {
    if (!story) {
      console.log("Missing Story Error")
      return;
    }
    navigate(`/pageLinks/${id}`);
  }

  const handleDeleteStory = () => {
    if (!story) {
      console.log("Missing Story Error")
      return;
    }
    deleteStory(story.id).then(() => {
      navigate("/created");
    }).catch(error => {
      console.log(error);
    });

  }

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
    const newComment = await createComment(storyId, commentText);
    setComments([newComment, ...comments]);
    unfocusComment();
  }

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleArchive = async () => {
    const archiveResponse = await archiveStory(storyId);
    setStory(archiveResponse);
  }

  const handlePublish = async () => {
    const publishResponse = await publishStory(storyId);
    setStory(publishResponse);
  }

  const handleLoadPlaythrough = (playthroughId: number | undefined) => {
    if (!playthroughId) {
      console.log("Missing playthrough id!");
      return;
    }
    loadPlaythrough(playthroughId).then(() => navigate(`/playthrough/${playthroughId}`));
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
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="h6">Your Playthroughs</Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartNewPlaythrough}
                  >
                    Start New Playthrough
                  </Button>

                  {currentPlaythrough && (
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleLoadPlaythrough(currentPlaythrough.id)}
                    >
                      Continue Current Playthrough
                    </Button>
                  )}

                  {playthroughs.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>Load Saved Playthrough</Typography>
                      <Stack spacing={1}>
                        {playthroughs.map(p => (
                          <Button
                            key={p.id}
                            variant="text"
                            onClick={() => handleLoadPlaythrough(p.id)}
                          >
                            {`Playthrough from ${formatDateString(p.startedAt)} (Last Page: ${p.currentPage})`}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              )}
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack>
                {user?.username === story?.user.username && 
                  <>
                    <ButtonGroup aria-label="Basic button group" sx={{marginBottom: 1}}>
                      <Button color='secondary' onClick={handleEditStory}>
                        {story?.status === "DRAFT" ? 'Edit Properties' : 'Create / Edit Draft'}
                      </Button>
                      {story?.status === "DRAFT" && 
                        <Button color='secondary'onClick={handleEditPages}>
                          Edit Pages
                        </Button>
                      }
                      <Button color='error' onClick={handleDeleteStory}>Delete Story</Button>
                    </ButtonGroup>
                    <Box mb={1}>
                      <Typography>Status: {story?.status}</Typography>
                      {story?.status === "PUBLISHED" 
                        ? <Button variant="contained" onClick={handleArchive}>ARCHIVE</Button> 
                        : <Button variant="contained" onClick={handlePublish}>PUBLISH</Button>
                      }
                    </Box>
                  </>
                }
                <Typography variant='h4'>{story?.title}</Typography>
                <Typography variant='h6'>By: {story?.user.username}</Typography>
                <Typography>Pages: {story?.pageCount}</Typography>
                <Typography>Created: {formatDateString(story?.createdAt)}</Typography>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography>Genres:&nbsp;</Typography>
                  {story?.genres.map(genre => <Chip variant="outlined" label={genre} key={genre} />)}
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography>Tags:&nbsp;</Typography>
                  {story?.tags.map(tag => <Chip variant="outlined" label={tag} key={tag} />)}
                </Box>
                <Typography>Description: {story?.description}
                </Typography>
              </Stack>
            </Grid>
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
            comments.map(comment => (
              <CommentBlock 
                key={comment.id} 
                comment={comment} 
                showDelete={user?.username === comment.username}
                onDelete={handleCommentDelete}
              />
            ))
          )
        }
      </Stack>
    </Box>
  );
}