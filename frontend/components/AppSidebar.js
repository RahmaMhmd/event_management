"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useAuth } from "../lib/AuthContext";

export const drawerWidth = 260;

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClose = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push("/login");
  };

  const isActive = (path) => {
    if (path === "/" || path === "/admin") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // 1. Navigation items for Admin
  const adminItems = [
    {
      label: "Admin Portal",
      path: "/admin",
      icon: <DashboardIcon />,
    },
    {
      label: "Events Management",
      path: "/events",
      icon: <EventIcon />,
    },
    {
      label: "Create Event",
      path: "/create-event",
      icon: <AddCircleIcon />,
    },
    {
      label: "Pending Approvals",
      path: "/admin/pending",
      icon: <PendingActionsIcon />,
    },
    {
      label: "Users Management",
      path: "/admin/users",
      icon: <PeopleIcon />,
    },
  ];

  // 2. Navigation items for logged-in regular user
  const userItems = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon />,
    },
    {
      label: "Explore Events",
      path: "/events",
      icon: <EventIcon />,
    },
    {
      label: "Create Event",
      path: "/create-event",
      icon: <AddCircleIcon />,
    },
    {
      label: "My Registrations",
      path: "/my-registrations",
      icon: <HowToRegIcon />,
    },
  ];

  // 3. Navigation items for guests (not logged in)
  const guestItems = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon />,
    },
    {
      label: "Explore Events",
      path: "/events",
      icon: <EventIcon />,
    },
  ];

  const currentItems = !user ? guestItems : isAdmin ? adminItems : userItems;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: isAdmin
                ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                : "linear-gradient(135deg, #4f46e5, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
          >
            {isAdmin ? <AdminPanelSettingsIcon fontSize="small" /> : <EventIcon fontSize="small" />}
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              {isAdmin ? "ADMIN HUB" : "EVENT HUB"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {isAdmin ? "Control Panel" : "Community"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "#64748b" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* User Info Capsule if logged in */}
      {user && (
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: isAdmin ? "rgba(124, 58, 237, 0.05)" : "rgba(79, 70, 229, 0.05)",
              border: `1px solid ${isAdmin ? "rgba(124, 58, 237, 0.15)" : "rgba(79, 70, 229, 0.12)"}`,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: isAdmin ? "secondary.main" : "primary.main",
                fontWeight: 800,
                fontSize: "0.9rem",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box sx={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}
              >
                {user.name}
              </Typography>
              <Chip
                label={isAdmin ? "Administrator" : "Standard User"}
                size="small"
                color={isAdmin ? "secondary" : "primary"}
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  mt: 0.25,
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation List */}
      <List sx={{ px: 1.5, py: 1.5, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            pb: 1,
            display: "block",
            color: "#94a3b8",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.68rem",
            letterSpacing: "0.5px",
          }}
        >
          {isAdmin ? "Administration" : "Main Navigation"}
        </Typography>

        {currentItems.map((item) => {
          const active = isActive(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={handleClose}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  px: 1.75,
                  color: active ? "#ffffff" : "#475569",
                  background: active
                    ? isAdmin
                      ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                      : "linear-gradient(135deg, #4f46e5, #4338ca)"
                    : "transparent",
                  boxShadow: active
                    ? isAdmin
                      ? "0 4px 14px rgba(124, 58, 237, 0.35)"
                      : "0 4px 14px rgba(79, 70, 229, 0.35)"
                    : "none",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: active
                      ? isAdmin
                        ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                        : "linear-gradient(135deg, #4f46e5, #4338ca)"
                      : "rgba(241, 245, 249, 0.8)",
                    color: active ? "#ffffff" : "#1e293b",
                    transform: "translateX(2px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: active ? "#ffffff" : "#64748b",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: active ? 700 : 500 }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Auth Section: Login & Logout in sidebar as requested */}
      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
        {!isLoading && user ? (
          // Logged in: show Logout
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.1,
              px: 1.75,
              color: "#ef4444",
              bgcolor: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.12)",
                color: "#dc2626",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                  Logout
                </Typography>
              }
            />
          </ListItemButton>
        ) : !isLoading ? (
          // Not logged in: show Login and Register in sidebar
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItemButton
              component={Link}
              href="/login"
              onClick={handleClose}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 1.75,
                bgcolor: "rgba(79, 70, 229, 0.08)",
                color: "primary.main",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(79, 70, 229, 0.15)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                    Login
                  </Typography>
                }
              />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/register"
              onClick={handleClose}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 1.75,
                color: "#475569",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  color: "#0f172a",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    Create Account
                  </Typography>
                }
              />
            </ListItemButton>
          </Box>
        ) : null}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Hamburger Button */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1200,
          display: { xs: "flex", md: "none" },
          backgroundColor: isAdmin ? "secondary.main" : "primary.main",
          color: "#ffffff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          "&:hover": {
            backgroundColor: isAdmin ? "secondary.dark" : "primary.dark",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.02)",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}