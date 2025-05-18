import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CheckEmail() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Verify Your Email
      </Typography>
      <Typography variant="body1">
        We've sent a verification email to your inbox. Please check it to complete your registration.
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{mt: 2}}
        onClick={() => navigate("/signIn")}
      >
        Sign In
      </Button>
    </Box>
  );
}