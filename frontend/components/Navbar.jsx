"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from "@mui/material";

import Link from "next/link";
import { useAuth } from "../lib/AuthContext";

import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Navbar({ onMobileMenuToggle }) {
  const { user, isAdmin, isLoading } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        color: "#0f172a",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "70px !important",
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              fontSize: { xs: "1rem", sm: "1.2rem" },
              letterSpacing: "-0.5px",
            }}
          >
            {isAdmin
              ? "Admin Management Portal"
              : "Event Management Hub"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              display: { xs: "none", sm: "block" },
              fontSize: "0.825rem",
            }}
          >
            {isAdmin
              ? "Oversee events, user accounts, and platform approvals"
              : "Discover, create, and join memorable community events"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {!isLoading && user ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: isAdmin
                    ? "secondary.main"
                    : "primary.main",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                }}
              >
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>

              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "0.95rem",
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                Welcome, {user.name}
              </Typography>
            </Box>
          ) : !isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="small"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  borderColor: "#cbd5e1",
                  color: "#334155",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor:
                      "rgba(79, 70, 229, 0.04)",
                  },
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="small"
                startIcon={<PersonAddIcon />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  fontWeight: 600,
                  boxShadow:
                    "0 2px 8px rgba(79, 70, 229, 0.25)",
                }}
              >
                Register
              </Button>
            </Box>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}