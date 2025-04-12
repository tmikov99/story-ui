import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { setSidebar } from '../redux/sidebarSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSidebar(false)); //Temp
    return () => {
      dispatch(setSidebar(true)); //Temp
    }
  }, [dispatch]);
  

  return (
    <Box sx={{ 
        position: 'fixed', 
        width: '100%', 
        top: 0, 
        right: 0,
        margin: "0!important",
        height: '100%', 
        backgroundImage: "url('/assets/pexels-helloaesthe-small.jpg')",
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
                color: 'white!important',
            }}>
                <Typography variant='h1'>Story Project</Typography>
                <Button 
                  sx={{ marginTop: 3 }} 
                  variant='contained' 
                  color='primary'
                  onClick={() => navigate("/")}
                >
                  Browse Stories
                </Button>
            </Box>
    </Box>
  );
}