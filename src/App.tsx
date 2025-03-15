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
import PageCreate from './components/PageCreate';
import PageCreateLinks from './components/PageCreateLinks';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AppHeader from './components/AppHeader';
import HomePage from './components/HomePage';


let signedIn = true;
function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        {!signedIn ?
          <Routes>
            <Route path="signIn" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<HomePage />} />
          </Routes> 
          : 
          <Box sx={{ display: 'flex' }}>
            <AppHeader />
            <SideMenu />
            <Box 
              component="main"
              sx={(theme) => ({
                  flexGrow: 1,
                  backgroundColor: alpha(theme.palette.background.default, 1),
                  overflow: 'auto',
                  marginTop: 7, //TODO: Make responsive ASAP
                })}>
              <Stack
                spacing={2}
                sx={{
                  alignItems: 'center',
                  mx: 3,
                  pb: 5,
                }}
              >
                <Header />
                <Routes>
                  <Route path="/" element={<MainGrid />}/>
                  <Route path="/page" element={<Page />}/>
                  <Route path="/create" element={<PageCreateOverview />}/>
                  <Route path="/createPage" element={<PageCreate />}/>
                  <Route path="createLinks" element={<PageCreateLinks />}/>
                  <Route path="/home" element={<HomePage />} />
                </Routes>    
              </Stack>
            </Box>
          </Box>
        }
        
      </BrowserRouter>
    </AppTheme>
  )
}

export default App;
