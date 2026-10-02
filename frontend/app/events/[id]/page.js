"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { getEventById, registerForEvent } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAdmin } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEventById(params.id);
        setEvent(data.event);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  const handleRegisterClick = () => {
    if (isAdmin) {
      return;
    }

    if (!token) {
      router.push("/login");
      return;
    }

    setDialogOpen(true);
  };

  const handleConfirmRegistration = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setRegistering(true);

    try {
      const data = await registerForEvent(event._id, token);

      setDialogOpen(false);

      setSnackbar({
        open: true,
        message: data.message || "Registered successfully!",
        severity: "success",
      });
    } catch (error) {
      setDialogOpen(false);

      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Event not found.</Alert>

        <Button
          component={Link}
          href="/events"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Button
        component={Link}
        href="/events"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Events
      </Button>

      <Card
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={
            event.image ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          }
          alt={event.title}
        />

        <CardContent
          sx={{
            p: { xs: 3, md: 5 },
          }}
        >
          <Chip
            label={event.category?.name || "General"}
            sx={{
              mb: 2,
              fontWeight: 700,
            }}
          />

          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
            }}
          >
            {event.title}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              fontSize: "1.05rem",
              lineHeight: 1.8,
            }}
          >
            {event.description}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Stack spacing={2.5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <EventIcon color="primary" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Date
                </Typography>

                <Typography fontWeight={700}>
                  {formatDate(event.date)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <LocationOnIcon color="primary" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>

                <Typography fontWeight={700}>{event.location}</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <GroupsIcon color="primary" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Available Seats
                </Typography>

                <Typography fontWeight={700}>{event.seats} seats</Typography>
              </Box>
            </Box>
          </Stack>

          {!isAdmin && (
            <Button
              variant="contained"
              size="large"
              startIcon={<HowToRegIcon />}
              onClick={handleRegisterClick}
              sx={{
                mt: 4,
                px: 4,
                py: 1.5,
                fontWeight: 800,
                borderRadius: 2,
              }}
            >
              Register for Event
            </Button>
          )}
        </CardContent>
      </Card>

      {/* CONFIRMATION DIALOG */}

      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (!registering) {
            setDialogOpen(false);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={800}>Confirm Registration</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to register for:
          </DialogContentText>

          <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
            {event.title}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {formatDate(event.date)} • {event.location}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={registering}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirmRegistration}
            disabled={registering}
          >
            {registering ? "Registering..." : "Confirm Registration"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
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
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
          sx={{
            width: "100%",
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
