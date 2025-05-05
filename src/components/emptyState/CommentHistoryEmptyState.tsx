import EmptyState from "./EmptyState";
import CommentIcon from '@mui/icons-material/Comment';

export default function CommentHistoryEmptyState() {
  return (
    <EmptyState 
      title="Keep track of what you've said" 
      message="Comment history isn't viewable when signed out"
      Icon={CommentIcon}
      loginRedirect
    />
  );
}