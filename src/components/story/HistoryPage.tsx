import { Typography, Card, CardContent, LinearProgress, Button, CardMedia, Stack, Skeleton, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlaythrough, fetchUserPlaythroughs, loadPlaythrough } from "../../api/playthrough";
import Grid from '@mui/material/Grid2';
import EmptyState from "../emptyState/EmptyState";
import HistoryIcon from '@mui/icons-material/History';
import { PlaythroughData } from "../../types/playthrough";

export default function HistoryPage() {
  const [history, setHistory] = useState<PlaythroughData[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPlaythroughs()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
            <Card key={entry.id}>
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
                    <LinearProgress
                      variant="determinate"
                      value={(entry.path.length / entry.story.pageCount) * 100}
                      sx={{ mt: 1, mb: 1 }}
                    />
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
    </div>
  );
}