import AppTheme from './theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import SideMenu from './components/navigation/SideMenu';
import MainGrid from './components/story/MainGrid';
import Page from './components/page/Page';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StoryPagesOverview from './components/story/StoryPagesOverview';
import SignIn from './components/user/SignIn';
import SignUp from './components/user/SignUp';
import AppHeader from './components/navigation/AppHeader';
import HomePage from './components/HomePage';
import StoryPage from './components/story/StoryPage';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import StoryCreate from './components/story/StoryCreate';
import PageLinks from './components/page/PageLinks';
import StoryEdit from './components/story/StoryEdit';
import AccountSettings from './components/user/AccountSettings';
import { fetchFavorite, fetchLiked, fetchStories } from './api/story';
import ProfilePage from './components/user/ProfilePage';
import HistoryPage from './components/story/HistoryPage';
import HistoryEmptyState from './components/emptyState/HistoryEmptyState';
import FavoriteEmptyState from './components/emptyState/FavoriteEmptyState';
import LikedEmptyState from './components/emptyState/LikedEmptyState';

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
        <Stack spacing={2} sx={{ alignItems: 'center', m: 3, pb: 5, }}>
          <Routes>
            <Route path="/" element={<MainGrid title="Browse" fetchMethod={fetchStories} showActions={true} />}/>
            <Route path="/story/:storyId/page/:pageNumber" element={<Page />}/>
            <Route path="/story/:id" element={<StoryPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/history" element={ isAuthenticated ? <HistoryPage /> : <HistoryEmptyState /> }/>
            <Route 
              path="/favorite" 
              element={ 
                isAuthenticated ? (
                  <MainGrid title="Favorite Stories" fetchMethod={ fetchFavorite } showActions={false} /> 
                ) : (
                  <FavoriteEmptyState />
                )
              }
            />
            <Route 
              path="/liked" 
              element={
                isAuthenticated ? (
                  <MainGrid title="Liked Stories" fetchMethod={fetchLiked} showActions={false} />
                ) : (
                  <LikedEmptyState />
                )
              }
            />
            {isAuthenticated && <Route path="/create" element={<StoryCreate />}/>}
            {isAuthenticated && <Route path="/create/:storyId/overview" element={<StoryPagesOverview />}/>}
            {isAuthenticated && <Route path="/edit/:storyId" element={<StoryEdit />} />}
            {isAuthenticated && <Route path="/pageLinks/:storyId" element={<PageLinks />}/>}
            {isAuthenticated && <Route path="/account" element={<AccountSettings />} />}
            <Route path="/user/:username" element={<ProfilePage />} />
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
