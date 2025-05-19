import { styled, Stack, Typography, Box, FormControl, FormLabel, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { SitemarkIcon } from "../CustomIcons";
import MuiCard from '@mui/material/Card';

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const ResetContainer = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  padding: theme.spacing(2),
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  ...theme.applyStyles("dark", {
    background:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(token, password);
      setMessage("Password has been reset successfully.");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setMessage("Failed to reset password: " + (err as Error).message);
    }
  };

  return (
    <ResetContainer>
      <Card variant="outlined">
        <SitemarkIcon />
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="new-password">New Password</FormLabel>
            <TextField
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              fullWidth
            />
          </FormControl>
          <Button type="submit" variant="contained" fullWidth>
            Reset Password
          </Button>
        </Box>
        {message && (
          <Typography variant="body2" color="textSecondary" align="center">
            {message}
          </Typography>
        )}
      </Card>
    </ResetContainer>
  );
}