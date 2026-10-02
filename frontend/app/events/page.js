"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

import {
  getEvents,
  getCategories,
  updateEvent,
  deleteEvent,
} from "../../lib/api";

import { useAuth } from "../../lib/AuthContext";

export default function EventsPage() {
  const { token, isAdmin } = useAuth();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Event State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    seats: "",
    image: "",
  });

  const [updating, setUpdating] = useState(false);

  // Delete Event State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load Events + Categories
  const loadData = async () => {
    try {
      setLoading(true);

      const [eventsData, categoriesData] = await Promise.all([
        getEvents(),
        getCategories(),
      ]);

      setEvents(eventsData.events || []);
      setCategories(categoriesData.categories || []);

      setError("");
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Events
  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase().trim();

    return events.filter((ev) => {
      const matchCat = category === "All" || ev.category?._id === category;

      const matchSearch =
        q === "" ||
        ev.title?.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [events, search, category]);

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "TBD";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Admin: Open Edit Dialog
  const handleOpenEdit = (ev) => {
    setSelectedEvent(ev);

    setEditForm({
      title: ev.title || "",
      description: ev.description || "",
      category: ev.category?._id || "",
      date: ev.date ? ev.date.split("T")[0] : "",
      location: ev.location || "",
      seats: ev.seats || "",
      image: ev.image || "",
    });

    setEditModalOpen(true);
  };

  // Admin: Submit Edit Event
  const handleSaveEdit = async () => {
    if (!selectedEvent) return;

    setUpdating(true);

    try {
      await updateEvent(
        selectedEvent._id,
        {
          ...editForm,
          seats: Number(editForm.seats),
        },
        token,
      );

      setSnackbar({
        open: true,
        message: "Event updated successfully!",
        severity: "success",
      });

      setEditModalOpen(false);

      await loadData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update event",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Admin: Open Delete Dialog
  const handleOpenDelete = (ev) => {
    setEventToDelete(ev);
    setDeleteDialogOpen(true);
  };

  // Admin: Confirm Delete Event
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setDeleting(true);

    try {
      await deleteEvent(eventToDelete._id, token);

      setSnackbar({
        open: true,
        message: "Event deleted successfully!",
        severity: "success",
      });

      setDeleteDialogOpen(false);
      setEventToDelete(null);

      await loadData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete event",
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Header */}
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
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: "-1px",
              mb: 0.5,
            }}
          >
            {isAdmin ? "Manage Platform Events" : "Explore Events"}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {isAdmin
              ? "Oversee, modify, or remove published events across the platform."
              : "Search through upcoming events, discover exciting activities, and reserve your place."}
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/create-event"
          variant="contained"
          size="medium"
          startIcon={<AddCircleIcon />}
          sx={{
            borderRadius: 2.5,
            px: 2.5,
            py: 1,
            fontWeight: 700,
          }}
        >
          {isAdmin ? "Add New Event" : "Create Event"}
        </Button>
      </Box>

      {/* Filter & Search Bar */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3.5,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            {/* Search */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title, description, or city..."
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

            {/* Category Filter */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-filter-label">
                  Filter Category
                </InputLabel>

                <Select
                  labelId="category-filter-label"
                  value={category}
                  label="Filter Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="All">All Categories</MenuItem>

                  {categories.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Reset */}
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                startIcon={<FilterListOffIcon />}
                sx={{
                  borderRadius: 2,
                  height: 40,
                  fontWeight: 600,
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="primary" />

          <Typography variant="body2" color="text.secondary">
            Fetching events...
          </Typography>
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            mb: 4,
            border: "1px solid #fecaca",
          }}
        >
          <Typography color="error" variant="h6" sx={{ mb: 2 }}>
            {error}
          </Typography>

          <Button variant="contained" onClick={loadData}>
            Retry Loading
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3.5,
            border: "1px solid #e2e8f0",
          }}
        >
          <EventIcon
            sx={{
              fontSize: 64,
              color: "#94a3b8",
              mb: 2,
            }}
          />

          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            No Matching Events Found
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or resetting filters.
          </Typography>

          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Events Grid */}
      {!loading && !error && filteredEvents.length > 0 && (
        <Box>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={800} color="#1e293b">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "Event Found" : "Events Available"}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredEvents.map((ev) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ev._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3.5,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 32px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  {/* Event Banner */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="190"
                      image={
                        ev.image ||
                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"
                      }
                      alt={ev.title}
                      sx={{ bgcolor: "#f1f5f9" }}
                    />

                    {/* Admin Actions */}
                    {isAdmin && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "rgba(255, 255, 255, 0.92)",
                          borderRadius: 2,
                          p: 0.5,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <Tooltip title="Edit Event">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEdit(ev)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Event">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDelete(ev)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Category + Date */}
                    <Box
                      sx={{
                        mb: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={ev.category?.name || "General"}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {formatDate(ev.date)}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        mb: 1,
                        minHeight: 56,
                        lineHeight: 1.3,
                      }}
                    >
                      {ev.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2.5,
                        minHeight: 40,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {ev.description}
                    </Typography>

                    {/* Meta Info */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: "#64748b" }}
                        />

                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: "#475569" }}
                        >
                          {ev.location}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PeopleIcon
                          fontSize="small"
                          sx={{ color: "#64748b" }}
                        />

                        <Typography variant="body2" sx={{ color: "#475569" }}>
                          {ev.seats} Seats Available
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bottom Buttons */}
                    <Box
                      sx={{
                        mt: "auto",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        component={Link}
                        href={`/events/${ev._id}`}
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                        }}
                      >
                        View Details
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleOpenEdit(ev)}
                          sx={{
                            borderRadius: 2,
                            minWidth: 42,
                            px: 1.5,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ADMIN EDIT EVENT MODAL */}
      <Dialog
        open={editModalOpen}
        onClose={() => !updating && setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Event Details</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  title: e.target.value,
                })
              }
              required
            />

            {/* Category */}
            <FormControl fullWidth required>
              <InputLabel id="edit-category-label">Category</InputLabel>

              <Select
                labelId="edit-category-label"
                value={editForm.category}
                label="Category"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Date"
              value={editForm.date}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  date: e.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />

            <TextField
              fullWidth
              label="Location"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  location: e.target.value,
                })
              }
              required
            />

            <TextField
              fullWidth
              type="number"
              label="Seats"
              value={editForm.seats}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  seats: e.target.value,
                })
              }
              required
            />

            <TextField
              fullWidth
              label="Image URL"
              value={editForm.image}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  image: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  description: e.target.value,
                })
              }
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditModalOpen(false)} disabled={updating}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={updating}
          >
            {updating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADMIN DELETE EVENT CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Event</DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Are you sure you want to permanently delete this event? This action
            cannot be undone.
          </Typography>

          <Typography variant="subtitle1" fontWeight={800} color="error">
            {eventToDelete?.title}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
