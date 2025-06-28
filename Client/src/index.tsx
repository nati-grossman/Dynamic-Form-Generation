/**
 * Index - Application entry point
 *
 * This file sets up:
 * - React rendering
 * - Material UI theme with RTL support
 * - Global styles
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

import App from "./App";

// RTL cache setup
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [require("stylis").prefixer, rtlPlugin],
});

// Material UI theme with RTL support
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: ["Rubik", "Roboto", "Arial", "sans-serif"].join(","),
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
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
