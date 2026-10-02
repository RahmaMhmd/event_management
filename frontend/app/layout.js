"use client";

import { Box, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import AppSidebar, { drawerWidth } from "../components/AppSidebar";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../lib/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
      light: "#6366f1",
      dark: "#3730a3",
    },
    secondary: {
      main: "#7c3aed",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>EventHub - Event Management System</title>
        <meta
          name="description"
          content="Modern Event Management System - Discover, Create and Register for Events"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Box
              sx={{
                minHeight: "100vh",
                background: "#f8fafc",
                display: "flex",
              }}
            >
              <AppSidebar />

              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Navbar />

                <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
                  {children}
                </Box>
              </Box>
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}