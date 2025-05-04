import EmptyState from "./EmptyState";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function FavoriteEmptyState() {
  return (
    <EmptyState 
      title="Enjoy your favorite stories" 
      message="Sign in to access stories that you’ve saved"
      Icon={FavoriteIcon}
      loginRedirect
    />
  );
}