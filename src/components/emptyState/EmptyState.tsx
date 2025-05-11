import { Stack, Typography, Button } from "@mui/material";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useLocation, useNavigate } from "react-router-dom";
import { SvgIconComponent } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setRedirectAfterLogin } from "../../redux/authSlice";


interface EmptyStateProps {
  title: string;
  message: string;
  loginRedirect?: boolean;
  Icon?: SvgIconComponent;
}

export default function EmptyState({ title, message, Icon, loginRedirect }: EmptyStateProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSignInRedirect = () => {
    dispatch(setRedirectAfterLogin(location.pathname));
    navigate('/signIn');
  };

  return (
    <Stack   
      direction="column"
      spacing={2}
      sx={{
        justifyContent: "flex-start",
        alignItems: "center",
        pt: 10,
      }}
    >
      {Icon && <Icon sx={{ fontSize: 150 }} />}
      <Typography variant="h3" textAlign="center">{title}</Typography>
      <Typography variant="body2" textAlign="center">{message}</Typography>
      {loginRedirect && <Button 
          variant='outlined' 
          startIcon={<AccountCircleRoundedIcon />}
          onClick={handleSignInRedirect}
        >
          Sign In
        </Button>
      }
    </Stack>
  );
}