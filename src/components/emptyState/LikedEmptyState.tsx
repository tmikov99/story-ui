import EmptyState from "./EmptyState";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

export default function LikedEmptyState() {
  return (
    <EmptyState 
      title="Enjoy your liked stories" 
      message="Sign in to access stories that you’ve liked"
      Icon={ThumbUpAltIcon}
      loginRedirect
    />
  );
}