"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  getMyRegistrations,
  cancelRegistration,
} from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";

export default function MyRegistrationsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRegistrations = async () => {
    if (!token) {
      setError("Please login to view your registrations.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMyRegistrations(token);
      setRegistrations(data.registrations || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (token) {
        loadRegistrations();
      } else {
        setLoading(false);
        setError("Please login to view your registrations.");
      }
    }
  }, [authLoading, token]);

  const handleCancel = async (eventId) => {
    if (!token) return;

    try {
      await cancelRegistration(eventId, token);

      setRegistrations((current) =>
        current.filter(
          (registration) =>
            registration.event?._id !== eventId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
        >
          My Registrations
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          View the events you have registered for.
        </Typography>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {!loading &&
          !error &&
          registrations.length === 0 && (
            <Alert severity="info">
              You haven't registered for any events yet.
            </Alert>
          )}

        {!loading &&
          registrations.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {registrations.map((registration) => {
                const event = registration.event;

                if (!event) {
                  return null;
                }

                return (
                  <Card
                    key={registration._id}
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Chip
                        label="Registered"
                        color="success"
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {event.title}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <EventIcon color="primary" />

                        <Typography>
                          {new Date(
                            event.date
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        <LocationOnIcon color="primary" />

                        <Typography>
                          {event.location}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        <Button
                          component={Link}
                          href={`/events/${event._id}`}
                          variant="outlined"
                        >
                          View Event
                        </Button>

                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() =>
                            handleCancel(event._id)
                          }
                        >
                          Cancel
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
      </Box>
    </Container>
  );
}