import TextEditor from './textEditor/TextEditor';
import Header from './components/Header';
import AppTheme from './theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import SideMenu from './components/SideMenu';
import MainGrid from './components/MainGrid';
import Page from './components/Page';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageCreateOverview from './components/PageCreateOverview';



function App() {

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <SideMenu />
          <Box 
            component="main"
            sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: alpha(theme.palette.background.default, 1),
                overflow: 'auto',
              })}>
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />
              <Routes>
                <Route path="/" element={<MainGrid />}/>
                <Route path="/page" element={<Page />}/>
                <Route path="/create" element={<PageCreateOverview />}/>
              </Routes>    
            </Stack>
          </Box>
        </Box>
      </BrowserRouter>
    </AppTheme>
  )
}

export default App;
