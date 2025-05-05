import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StoryCard from './StoryCard';
import { useEffect, useState } from 'react';
import { PaginatedResponse, StoryData } from '../../types/story';
import { useNavigate } from 'react-router-dom';
import { Pagination, Skeleton } from '@mui/material';
import EmptyState from '../emptyState/EmptyState';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';


interface MainGridProps {
  fetchMethod: (params?: {
    query?: string;
    page?: number;
    size?: number;
  }) => Promise<PaginatedResponse<StoryData>>;
  title: string;
  showActions: boolean;
  placeholderText?: string;
}

export default function MainGrid({fetchMethod, title, showActions, placeholderText}: MainGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stories, setStories] = useState<StoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(12);
  const queryParam = searchParams.get('query') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = pageParam - 1;

  useEffect(() => {
    fetchMethod({ query: queryParam, page: page, size: pageSize,  })
      .then((response) => {
        setStories(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((err) => {
        console.error('Error fetching stories:', err);
        setStories([]);
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [fetchMethod, queryParam, page, pageSize]);

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
        <Box>
          <Skeleton variant="rectangular" height={475} sx={{ borderRadius: 1 }} />
        </Box>
      </Grid>
    ));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {loading ? (
        <Grid container spacing={2} columns={12}>
          {renderSkeletons(8)}
        </Grid>
      ) : stories.length === 0 ? (
        <EmptyState 
          title={placeholderText || "No stories found"} 
          message="We couldn't find any relevant stories"
          Icon={SearchIcon}
        />
      ) : (
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          {stories.map((story, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                <StoryCard storyData={story} showActions={showActions} onClick={(story) => navigate(`/story/${story.id}`)}/>
            </Grid>
          ))}
        </Grid>
      )}
      {!loading && stories.length > 0 && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => {
              setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('page', value.toString());
                return newParams;
              });
            }}
            siblingCount={2}
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}