import { Typography, Card, CardContent, LinearProgress, Button, CardMedia, Stack, Skeleton, Box, Chip, Pagination } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deletePlaythrough, fetchUserPlaythroughs, loadPlaythrough } from "../../api/playthrough";
import Grid from '@mui/material/Grid2';
import EmptyState from "../emptyState/EmptyState";
import HistoryIcon from '@mui/icons-material/History';
import { PlaythroughData } from "../../types/playthrough";

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const [history, setHistory] = useState<PlaythroughData[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(1);
  const page = pageParam - 1;

  useEffect(() => {
    if (history.length === 0) {
      setLoading(true);
    }
    fetchUserPlaythroughs(page, PAGE_SIZE)
      .then(data => {
        if (data.totalPages > 0 && page >= data.totalPages) {
          setSearchParams({ page: '1' });
          return;
        }
        setHistory(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleResume = (playthroughId: number) => {
    loadPlaythrough(playthroughId).then(() => navigate(`/playthrough/${playthroughId}`));
  };

  const handleDelete = async (playthroughId: number) => {
    try {
      await deletePlaythrough(playthroughId);
      setHistory(prev => prev.filter(p => p.id !== playthroughId));
    } catch (error) {
      console.error("Failed to delete playthrough", error);
    }
  };

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Skeleton 
        variant="rectangular" 
        height={180} 
        width={580} 
        key={index} 
        sx={{ 
          borderRadius: 1 
        }} 
      />
    ));
  };

  return (
    <div>
      <Typography variant="h4" sx={{textAlign: 'center'}} gutterBottom>Reading History</Typography>
      
      <Stack gap={2}>
      {loading ? (
          renderSkeletons(4)
        ) : (
          history.length === 0 ? (
            <EmptyState 
              title="No History Entries" 
              message="There aren't any stories in your recent history" 
              Icon={HistoryIcon}
            />
          ) : (history.map((entry: any) => (
            <Card 
              key={entry.id}
              sx={entry.completed ? (theme => ({
                borderColor: theme.palette.mode === 'dark'
                  ? theme.palette.success.dark
                  : theme.palette.success.light,
                })) : {}
              }
            >
              <Grid container>
                <Grid size={{xs:4}}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={entry.story.coverImageUrl || "/assets/placeholder.jpg"}
                    alt="Story Cover"
                  />
                </Grid>
                <Grid size={{xs:8}}>
                  <CardContent sx={{ml: 2}}>
                    <Typography variant="h6">{entry.story.title}</Typography>
                    <Typography variant="body2">Last visited: {new Date(entry.lastVisited).toLocaleString()}</Typography>
                    <Typography variant="body2">Progress: Page {entry.currentPage}</Typography>
                    {entry.completed ? 
                      <Box>
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          sx={{ mt: 1, mb: 1 }}
                        />
                      </Box> :
                      <LinearProgress
                        variant="determinate"
                        value={(entry.path.length / entry.story.pageCount) * 100}
                        sx={{ mt: 1, mb: 1 }}
                      />
                    }
                    <Button
                      variant="outlined"
                      onClick={() => handleResume(entry.id)}
                    >
                      {entry.completed ? 'View Again' : 'Resume'}
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(entry.id)}
                      sx={{ml: 1}}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          )))
        )}
      </Stack>
      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => {
              setSearchParams({ page: (value).toString() });
            }}            
            siblingCount={2}
            shape="rounded"
          />
        </Box>
      )}
    </div>
  );
}