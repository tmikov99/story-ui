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
import { fetchFavorite, fetchLiked, fetchStories, fetchTrending, fetchUserStories } from './api/story';
import ProfilePage from './components/user/ProfilePage';
import HistoryPage from './components/story/HistoryPage';
import HistoryEmptyState from './components/emptyState/HistoryEmptyState';
import FavoriteEmptyState from './components/emptyState/FavoriteEmptyState';
import LikedEmptyState from './components/emptyState/LikedEmptyState';
import UserEmptyState from './components/emptyState/UserEmptyState';
import EmptyState from './components/emptyState/EmptyState';
import ErrorIcon from '@mui/icons-material/Error';
import OwnedEmptyState from './components/emptyState/OwnedEmptyState';
import CommentHistoryPage from './components/comment/CommentHistoryPage';
import CommentHistoryEmptyState from './components/emptyState/CommentHistoryEmptyState';
import GlobalSnackbar from './components/GlobalSnackbar';
import ResetPassword from './components/user/ResetPassword';
import CheckEmail from './components/user/CheckEmail';
import { ConfirmDialogProvider } from './hooks/ConfirmDialogProvider';

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
            <Route 
              path="/" 
              element={
                <MainGrid 
                  title="Browse" 
                  fetchMethod={fetchStories}
                />
              }
            />
            <Route path="/trending" element={<MainGrid title="Trending" fetchMethod={fetchTrending} showSort={false} />} /> 
            <Route path="/playthrough/:playthroughId" element={<Page />}/>
            <Route path="/story/:id" element={<StoryPage />} />
            <Route path="/landing" element={<HomePage />} />
            <Route path="/history" element={ isAuthenticated ? <HistoryPage /> : <HistoryEmptyState /> }/>
            <Route 
              path="/favorite" 
              element={ 
                isAuthenticated ? (
                  <MainGrid title="Favorite Stories" fetchMethod={ fetchFavorite } /> 
                ) : (
                  <FavoriteEmptyState />
                )
              }
            />
            <Route
              path="/liked" 
              element={
                isAuthenticated ? (
                  <MainGrid title="Liked Stories" fetchMethod={fetchLiked} />
                ) : (
                  <LikedEmptyState />
                )
              }
            />
            <Route
              path="created"
              element={
                isAuthenticated ? (
                  <MainGrid title="My Stories" fetchMethod={fetchUserStories} />
                ) : (
                  <OwnedEmptyState />
                )
              }
            />
            <Route
              path="comments"
              element={
                isAuthenticated ? (
                  <CommentHistoryPage />
                ) : (
                  <CommentHistoryEmptyState />
                )
              }
            />
            {isAuthenticated && <Route path="/create" element={<StoryCreate />}/>}
            {isAuthenticated && <Route path="/create/:storyId/overview" element={<StoryPagesOverview />}/>}
            {isAuthenticated && <Route path="/edit/:storyId" element={<StoryEdit />} />}
            {isAuthenticated && <Route path="/pageLinks/:storyId" element={<PageLinks />}/>}
            <Route path="/account" element={ isAuthenticated ? <AccountSettings /> : <UserEmptyState />} />
            <Route path="/user/:username" element={<ProfilePage />} />
            <Route 
              path="*" 
              element={
                <EmptyState 
                  title="Page Not Found" 
                  message="The page you are trying to access doesn't exist or requires authorization" 
                  Icon={ErrorIcon}
                />
              } 
            />
          </Routes>    
        </Stack>
      </Box>
      <GlobalSnackbar />
    </Box>
  </>

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ConfirmDialogProvider>
        <BrowserRouter>
            <Routes>
              {!isAuthenticated && <Route path="/signIn" element={<SignIn />} />}
              {!isAuthenticated && <Route path="/signUp" element={<SignUp />} />}
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="*" element={nonAuthContent} />
            </Routes>        
        </BrowserRouter>
      </ConfirmDialogProvider>
    </AppTheme>
  )
}

export default App;
