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
import StoryPagesOverview from './components/StoryPagesOverview';
import PageCreate from './components/PageCreate';
import PageCreateLinks from './components/PageCreateLinks';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AppHeader from './components/AppHeader';
import HomePage from './components/HomePage';
import StoryPage from './components/StoryPage';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import StoryCreate from './components/StoryCreate';
import PageEditWrapper from './components/PageEditWrapper';
import PageLinks from './components/PageLinks';
import StoryEdit from './components/StoryEdit';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const nonAuthContent = <>
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
        <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, }}>
          <Header />
          <Routes>
            <Route path="/" element={<MainGrid />}/>
            <Route path="/story/:storyId/page/:pageNumber" element={<Page />}/>
            <Route path="/story/:id" element={<StoryPage />} />
            <Route path="/home" element={<HomePage />} />
            {isAuthenticated && <Route path="/create" element={<StoryCreate />}/>}
            {isAuthenticated && <Route path="/create/:storyId/overview" element={<StoryPagesOverview />}/>}
            {isAuthenticated && <Route path="/create/:storyId/page" element={<PageCreate />}/>}
            {isAuthenticated && <Route path="/edit/:storyId" element={<StoryEdit />} />}
            {isAuthenticated && <Route path="/edit/:storyId/page/:pageId" element={<PageEditWrapper />}/>}
            {isAuthenticated && <Route path="/pageLinks/:storyId" element={<PageLinks />}/>}
            {isAuthenticated && <Route path="/create/:storyId/page/:pageNumber/links" element={<PageCreateLinks />}/>}
          </Routes>    
        </Stack>
      </Box>
    </Box>
  </>

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
          <Routes>
            {!isAuthenticated && <Route path="/signIn" element={<SignIn />} />}
            {!isAuthenticated && <Route path="/signUp" element={<SignUp />} />}
            <Route path="*" element={nonAuthContent} />
          </Routes>        
      </BrowserRouter>
    </AppTheme>
  )
}

export default App;
