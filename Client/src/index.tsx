/**
 * Index - Application entry point
 *
 * This file sets up:
 * - React rendering
 * - Material UI theme with LTR support
 * - Global styles
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import App from "./App";

// LTR cache setup
const cacheLtr = createCache({
  key: "muiltr",
});

// Material UI theme with LTR support
const theme = createTheme({
  direction: "ltr",
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CacheProvider value={cacheLtr}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
