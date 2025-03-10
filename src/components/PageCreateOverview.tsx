import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageCard from './PageCard';


const data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];


export default function PageCreateOverview() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Pages
        </Typography>
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          {data.map((card, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <PageCard
                  // {...card} 
                />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }