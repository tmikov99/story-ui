import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageCard from './PageCard';
import Stack from '@mui/material/Stack';

export default function PageCreateLinks() {
    return (
        <Grid container spacing={6}>
        <Grid size={{ md: 12, lg: "grow"}} order={{ md: 2, lg: 1 }}>
            <Typography variant="h2" sx={{textAlign: "center"}}>In</Typography>
            <Stack spacing={2}>
            <Box>
                    <Typography variant='h6'>Decision X</Typography>
                    <PageCard />
                </Box>
                <Box>
                    <Typography variant='h6'>Decision Y</Typography>
                    <PageCard />
                </Box>                
                <Box>
                    <Typography variant='h6'>Decision Z</Typography>
                    <PageCard />
                </Box>
            </Stack>
        </Grid>
        <Grid size={{ md: 12, lg: 5}} order={{ md: 1, lg: 2 }} sx={{display: "flex", alignItems: "center"}}>
            <Box> 
                <Typography variant="h2" sx={{textAlign: "center"}}>Page</Typography>
                <PageCard />
            </Box>
        </Grid>
        <Grid size={{ md: 12, lg: "grow"}} order={{ md: 3, lg: 3 }}>
            <Typography variant="h2" sx={{textAlign: "center"}}>Out</Typography>
            <Stack spacing={2}>
                <Box>
                    <Typography variant='h6'>Decision X</Typography>
                    <PageCard />
                </Box>
                <Box>
                    <Typography variant='h6'>Decision Y</Typography>
                    <PageCard />
                </Box>
            </Stack>
        </Grid>
      </Grid>
    );
  }