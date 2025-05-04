import EmptyState from "./EmptyState";
import HistoryIcon from '@mui/icons-material/History';

export default function HistoryEmptyState() {
  return (
    <EmptyState 
      title="Keep track of what you read" 
      message="Story history isn't viewable when signed out"
      Icon={HistoryIcon}
      loginRedirect
    />
  );
}