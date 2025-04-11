import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useParams } from 'react-router-dom';

const testDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit 
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
    qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
    in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
    sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export default function MainGrid() {
  const { id } = useParams();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Story Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
      >
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box  sx={{
                position: "relative",
                '&:hover .startText': {
                    opacity: 1,
                    cursor: 'pointer',
                },
                '&:hover img': {
                    cursor: 'pointer',
                    opacity: '0.7',
                }
            }}>
                <Box
                    component="img"
                    sx={{
                        width: '100%',
                        transition: '0.3s',
                    }}
                    src="/assets/pexels-helloaesthe-small.jpg"
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
                    Start Reading
                </Typography>
            </Box>

          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack>
                <Typography variant='h4'>Example Story</Typography>
                <Typography variant='h6'>By: Example Author</Typography>
                <Typography>Pages: 167</Typography>
                <Typography>Created: 12 May 2028</Typography>
                <Typography>Tags: Fiction Adventure</Typography>
                <Typography>Description: {testDescription}
                </Typography>
            </Stack>
          </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        0 Comments
      </Typography>
      <Stack>
        {/*comments placeholder*/}
      </Stack>
    </Box>
  );
}