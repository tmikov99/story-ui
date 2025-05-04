import { Typography, Card, CardContent, LinearProgress, Button, CardMedia, Stack, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserPlaythroughs } from "../../api/playthrough";
import Grid from '@mui/material/Grid2';
import EmptyState from "../emptyState/EmptyState";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPlaythroughs()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleResume = (storyId: number, pageNumber: number) => {
    navigate(`/story/${storyId}/page/${pageNumber}`);
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
            <EmptyState title="No stories found" message="This list has no stories"/>
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
                      onClick={() => handleResume(entry.story.id, entry.currentPage)}
                    >
                      {entry.completed ? 'View Again' : 'Resume'}
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