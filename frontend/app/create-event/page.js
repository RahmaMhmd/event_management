"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

import TitleIcon from "@mui/icons-material/Title";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageIcon from "@mui/icons-material/Image";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { createEvent, getCategories } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, token, isAdmin, isLoading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    seats: "",
    image: "",
  });

  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        const loadedCategories = data.categories || [];

        setCategories(loadedCategories);

        // Select first category by default
        if (loadedCategories.length > 0) {
          setForm((prev) => ({
            ...prev,
            category: loadedCategories[0]._id,
          }));
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to load categories.",
          severity: "error",
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (user) {
      loadCategories();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      setImagePreviewError(false);
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.date ||
      !form.location.trim() ||
      !form.seats
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all mandatory fields.",
        severity: "error",
      });

      return;
    }

    if (Number(form.seats) <= 0) {
      setSnackbar({
        open: true,
        message: "Number of seats must be at least 1.",
        severity: "error",
      });

      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),

        // IMPORTANT:
        // Send Category ID, not Category name
        category: form.category,

        date: form.date,
        location: form.location.trim(),
        seats: Number(form.seats),
        image: form.image.trim(),
      };

      console.log("Sending event payload:", payload);

      const res = await createEvent(payload, token);

      setSnackbar({
        open: true,
        message:
          res.message ||
          (isAdmin
            ? "Event published successfully!"
            : "Event submitted successfully! Waiting for admin review."),
        severity: "success",
      });

      // Reset form
      setForm({
        title: "",
        description: "",
        category: categories.length > 0 ? categories[0]._id : "",
        date: "",
        location: "",
        seats: "",
        image: "",
      });

      // Redirect after successful creation
      setTimeout(() => {
        router.push("/events");
      }, 1500);
    } catch (err) {
      console.error("Create event error:", err);

      setSnackbar({
        open: true,
        message: err.message || "Failed to create event.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Back navigation */}
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 2.5,
          fontWeight: 700,
          color: "#64748b",
        }}
      >
        Back to Dashboard
      </Button>

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Form Header */}
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            background: isAdmin
              ? "linear-gradient(135deg, #1e1b4b, #4338ca)"
              : "linear-gradient(135deg, #312e81, #4f46e5)",
            color: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <AddCircleIcon sx={{ fontSize: 32 }} />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.5px",
              }}
            >
              {isAdmin ? "Publish Official Event" : "Create New Event"}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.85)",
              maxWidth: 650,
            }}
          >
            {isAdmin
              ? "As an Administrator, any event you create will be automatically approved and published live immediately to all platform attendees."
              : "Organize your event and share it with the community. Your submission will be reviewed and approved by an administrator before going live."}
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Status Note Banner */}
          {isAdmin ? (
            <Alert
              icon={<CheckCircleIcon fontSize="inherit" />}
              severity="success"
              sx={{
                mb: 3.5,
                borderRadius: 2.5,
              }}
            >
              <strong>Direct Approval:</strong> You are logged in as an
              Administrator. This event will be instantly active.
            </Alert>
          ) : (
            <Alert
              icon={<InfoOutlinedIcon fontSize="inherit" />}
              severity="info"
              sx={{
                mb: 3.5,
                borderRadius: 2.5,
              }}
            >
              <strong>Pending Review:</strong> After submitting, your event
              will receive a Pending status until confirmed by an admin.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Event Title */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. NextGen AI Summit 2026"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Category */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading || categories.length === 0}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  helperText={
                    categoriesLoading
                      ? "Loading categories..."
                      : categories.length === 0
                      ? "No categories available."
                      : "Select an event category"
                  }
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Event Date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Location */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Cairo Innovation Park / Online"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Number of Seats */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Capacity / Seats"
                  name="seats"
                  value={form.seats}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  required
                  slotProps={{
                    htmlInput: {
                      min: 1,
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventSeatIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Banner Image URL */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Cover Image URL (Optional)"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  helperText="Paste a public image link for your event cover banner"
                />
              </Grid>

              {/* Live Image Preview */}
              {form.image && !imagePreviewError && (
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#64748b",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Image Live Preview:
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{
                      height: 200,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      backgroundImage: `url(${form.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      bgcolor: "#f1f5f9",
                    }}
                  >
                    <Box
                      component="img"
                      src={form.image}
                      alt="Preview"
                      onError={() => setImagePreviewError(true)}
                      sx={{
                        display: "none",
                      }}
                    />
                  </Paper>
                </Grid>
              )}

              {/* Event Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Detailed Event Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your event, agenda, speakers, requirements, and target audience..."
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "flex-end",
              }}
            >
              <Button
                component={Link}
                href="/"
                variant="outlined"
                disabled={submitting}
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  fontWeight: 700,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={
                  submitting ||
                  categoriesLoading ||
                  categories.length === 0
                }
                startIcon={
                  submitting ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <AddCircleIcon />
                  )
                }
                sx={{
                  borderRadius: 2.5,
                  px: 4,
                  fontWeight: 800,
                  boxShadow:
                    "0 4px 14px rgba(79, 70, 229, 0.35)",
                }}
              >
                {submitting
                  ? "Submitting Event..."
                  : isAdmin
                  ? "Publish Event Now"
                  : "Submit For Approval"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
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
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}