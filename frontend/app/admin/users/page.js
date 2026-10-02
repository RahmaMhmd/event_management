"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getUsers, updateUser, deleteUser } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";

export default function AdminUsersPage() {
  const router = useRouter();
  const {
    user: currentUser,
    token,
    isAdmin,
    isLoading: authLoading,
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Edit Role Dialog
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [newRole, setNewRole] = useState("user");
  const [updatingRole, setUpdatingRole] = useState(false);

  // Delete User Dialog
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Feedback Toast
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getUsers(token);
      setUsers(data.users || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to load users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser || !isAdmin) {
        router.push("/");
        return;
      }
      loadUsers();
    }
  }, [currentUser, isAdmin, authLoading, router, token]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchSearch =
        q === "" ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  // Open Edit Role Dialog
  const handleOpenEditRole = (u) => {
    setRoleDialogUser(u);
    setNewRole(u.role || "user");
  };

  // Submit Role Change
  const handleSaveRole = async () => {
    if (!roleDialogUser) return;
    setUpdatingRole(true);
    try {
      await updateUser(roleDialogUser._id, { role: newRole }, token);
      setSnackbar({
        open: true,
        message: `Role for ${roleDialogUser.name} updated to ${newRole}`,
        severity: "success",
      });
      setRoleDialogUser(null);
      loadUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update role",
        severity: "error",
      });
    } finally {
      setUpdatingRole(false);
    }
  };

  // Confirm Delete User
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete._id, token);
      setSnackbar({
        open: true,
        message: `User account deleted successfully`,
        severity: "success",
      });
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete user",
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Navigation & Header */}
      <Button
        component={Link}
        href="/admin"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2.5, fontWeight: 700, color: "#64748b" }}
      >
        Back to Admin Portal
      </Button>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}
          >
            <PeopleIcon sx={{ fontSize: 36, color: "secondary.main" }} />
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, letterSpacing: "-1px" }}
            >
              User Accounts Management
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            View registered user profiles, modify administrative roles, and
            manage access privileges.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadUsers}
          sx={{ borderRadius: 2.5, fontWeight: 600 }}
        >
          Refresh Directory
        </Button>
      </Box>

      {/* Filter Toolbar */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3.5,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by full name or email address..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Select
                fullWidth
                size="small"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles ({users.length})</MenuItem>
                <MenuItem value="user">Members Only</MenuItem>
                <MenuItem value="admin">Administrators Only</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                Email Address
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                Assigned Role
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                Registered On
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 800, color: "#475569" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found matching your search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const isSelf =
                  currentUser &&
                  (currentUser._id === u._id || currentUser.id === u._id);
                return (
                  <TableRow
                    key={u._id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor:
                              u.role === "admin"
                                ? "secondary.main"
                                : "primary.main",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: "#1e293b" }}
                          >
                            {u.name} {isSelf && "(You)"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {u._id?.slice(-6)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: "#334155", fontWeight: 500 }}>
                      {u.email}
                    </TableCell>

                    <TableCell>
                      {u.role === "admin" ? (
                        <Chip
                          icon={
                            <AdminPanelSettingsIcon
                              sx={{ fontSize: "1rem !important" }}
                            />
                          }
                          label="Administrator"
                          size="small"
                          color="secondary"
                          sx={{ fontWeight: 700 }}
                        />
                      ) : (
                        <Chip
                          icon={
                            <PersonIcon sx={{ fontSize: "1rem !important" }} />
                          }
                          label="Member"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            color: "#475569",
                            borderColor: "#cbd5e1",
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                      {formatDate(u.createdAt)}
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <Tooltip title="Change Role">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEditRole(u)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {!isSelf && (
                          <Tooltip title="Delete User Account">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setUserToDelete(u)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Role Dialog */}
      <Dialog
        open={Boolean(roleDialogUser)}
        onClose={() => !updatingRole && setRoleDialogUser(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Change User Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2.5 }}>
            Update permissions for <strong>{roleDialogUser?.name}</strong>:
          </Typography>
          <Select
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <MenuItem value="user">Member (Standard User)</MenuItem>
            <MenuItem value="admin">Administrator (Full Access)</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setRoleDialogUser(null)}
            disabled={updatingRole}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRole}
            disabled={updatingRole}
          >
            {updatingRole ? "Saving..." : "Save Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={Boolean(userToDelete)}
        onClose={() => !deleting && setUserToDelete(null)}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Are you sure you want to permanently delete the account for:
          </Typography>
          <Typography variant="subtitle1" fontWeight={800} color="error">
            {userToDelete?.name} ({userToDelete?.email})
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUserToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
