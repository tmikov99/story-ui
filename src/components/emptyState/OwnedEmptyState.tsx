import EmptyState from "./EmptyState";
import BookIcon from '@mui/icons-material/Book';

export default function OwnedEmptyState() {
  return (
    <EmptyState 
      title="Manage your stories" 
      message="Sign in to access stories that you’ve created"
      Icon={BookIcon}
      loginRedirect
    />
  );
}