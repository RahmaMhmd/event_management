"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  getPendingEvents,
  approveEvent,
  rejectEvent,
} from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";

export default function PendingEventsPage() {
  const router = useRouter();
  const { user, token, isAdmin, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [action, setAction] = useState("");

  const [processing, setProcessing] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadPendingEvents = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getPendingEvents(token);
      setEvents(data.events || []);
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

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push("/");
        return;
      }
      loadPendingEvents();
    }
  }, [user, isAdmin, authLoading, token, router]);

  const openActionDialog = (event, type) => {
    setSelectedEvent(event);
    setAction(type);
  };

  const handleAction = async () => {
    const token = localStorage.getItem("token");

    if (!token || !selectedEvent) {
      return;
    }

    setProcessing(true);

    try {
      let data;

      if (action === "approve") {
        data = await approveEvent(
          selectedEvent._id,
          token
        );
      } else {
        data = await rejectEvent(
          selectedEvent._id,
          token
        );
      }

      setEvents((current) =>
        current.filter(
          (event) => event._id !== selectedEvent._id
        )
      );

      setSelectedEvent(null);
      setAction("");

      setSnackbar({
        open: true,
        message:
          data.message ||
          `Event ${action}d successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
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

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h3"
        fontWeight={900}
      >
        Pending Events
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mt: 1, mb: 5 }}
      >
        Review events submitted by users before publishing them.
      </Typography>

      {events.length === 0 ? (
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 60,
                color: "success.main",
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              fontWeight={800}
            >
              No Pending Events
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              All submitted events have been reviewed.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid
              size={{ xs: 12, md: 6 }}
              key={event._id}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "none",
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={
                    event.image ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  alt={event.title}
                />

                <CardContent sx={{ p: 3 }}>
                  <Chip
                    label="Pending Review"
                    color="warning"
                    size="small"
                    sx={{
                      mb: 1.5,
                      fontWeight: 700,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={800}
                  >
                    {event.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      lineHeight: 1.7,
                    }}
                  >
                    {event.description}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Category:</strong>{" "}
                      {event.category?.name}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Date:</strong>{" "}
                      {formatDate(event.date)}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Location:</strong>{" "}
                      {event.location}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Seats:</strong>{" "}
                      {event.seats}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                    >
                      <strong>Created By:</strong>{" "}
                      {event.createdBy?.name || "Unknown"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {event.createdBy?.email || ""}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      mt: 3,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() =>
                        openActionDialog(
                          event,
                          "approve"
                        )
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() =>
                        openActionDialog(
                          event,
                          "reject"
                        )
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CONFIRMATION */}

      <Dialog
        open={Boolean(selectedEvent)}
        onClose={() => {
          if (!processing) {
            setSelectedEvent(null);
            setAction("");
          }
        }}
      >
        <DialogTitle fontWeight={800}>
          {action === "approve"
            ? "Approve Event?"
            : "Reject Event?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {action === "approve"
              ? "approve"
              : "reject"}{" "}
            this event?
          </DialogContentText>

          <Typography
            fontWeight={800}
            sx={{ mt: 2 }}
          >
            {selectedEvent?.title}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setAction("");
            }}
            disabled={processing}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={
              action === "approve"
                ? "success"
                : "error"
            }
            onClick={handleAction}
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : action === "approve"
              ? "Approve"
              : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}