import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function HomePage() {
  return (
    <Box sx={{ 
        position: 'fixed', 
        width: '100%', 
        top: 0, 
        right: 0,
        margin: "0!important",
        height: '100%', 
        backgroundImage: "url('src/assets/pexels-helloaesthe-small.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        }}>
            <Box sx={{
                position: 'absolute',
                top: '30%',
                width: '100%',
                textAlign: 'center',
                padding: 4,
                background: 'rgba(0, 0, 0, 0.7)',
            }}>
                <Typography variant='h1'>Story Project</Typography>
                <Button sx={{marginTop: 3}} variant='outlined'>Browse Stories</Button>
            </Box>
    </Box>
  );
}