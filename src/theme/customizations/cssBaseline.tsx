import { Components, Theme } from "@mui/material";

export const cssBaselineCustomizations: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      ':root': {
        '--xy-controls-button-color': 'black',
      },
    },
  },
}