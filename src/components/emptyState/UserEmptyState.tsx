import EmptyState from "./EmptyState";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function UserEmptyState() {
  return (
    <EmptyState 
      title="Manage your account"
      message="Sign in to configure account settings"
      Icon={AccountCircleIcon}
      loginRedirect
    />
  );
}