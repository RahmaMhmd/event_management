"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedIcon from "@mui/icons-material/Verified";
import TuneIcon from "@mui/icons-material/Tune";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { getEvents, getPendingEvents, getUsers } from "../lib/api";

import { useAuth } from "../lib/AuthContext";

export default function Home() {
  const { user, isAdmin, token, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin stats
  const [adminStats, setAdminStats] = useState({
    eventsCount: 0,
    pendingCount: 0,
    usersCount: 0,
    pendingList: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const eventsData = await getEvents();

        const approvedEvents = eventsData.events || [];

        setEvents(approvedEvents);

        // Admin statistics
        if (isAdmin && token) {
          try {
            const [pendingData, usersData] = await Promise.all([
              getPendingEvents(token).catch(() => ({
                events: [],
                count: 0,
              })),

              getUsers(token).catch(() => ({
                users: [],
                count: 0,
              })),
            ]);

            setAdminStats({
              eventsCount: approvedEvents.length,
              pendingCount:
                pendingData.count || pendingData.events?.length || 0,

              usersCount: usersData.count || usersData.users?.length || 0,

              pendingList: (pendingData.events || []).slice(0, 3),
            });
          } catch (e) {
            console.error("Admin stats fetch error", e);
          }
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [isAdmin, token, authLoading]);

  // Get unique categories from events
  const categories = useMemo(() => {
    const uniqueCategories = new Map();

    events.forEach((event) => {
      if (event.category?._id) {
        uniqueCategories.set(event.category._id, event.category);
      }
    });

    return Array.from(uniqueCategories.values()).slice(0, 8);
  }, [events]);

  const featuredEvents = events.slice(0, 3);

  const formatDate = (date) => {
    if (!date) return "TBD";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />

        <Typography variant="body2" color="text.secondary">
          Loading platform data...
        </Typography>
      </Box>
    );
  }

  // =========================================================
  // ADMIN HOME
  // =========================================================

  if (isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Admin Hero */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 5,
            },
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
            color: "#ffffff",
            mb: 4,
            boxShadow: "0 10px 30px rgba(49, 46, 129, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: -30,
              bottom: -30,
              opacity: 0.1,
              transform: "rotate(-15deg)",
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <AdminPanelSettingsIcon
              sx={{
                fontSize: 260,
                color: "#fff",
              }}
            />
          </Box>

          <Box
            sx={{
              maxWidth: 750,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Chip
              icon={
                <VerifiedIcon
                  sx={{
                    color: "#a5b4fc !important",
                  }}
                />
              }
              label="SYSTEM ADMINISTRATOR CONSOLE"
              sx={{
                mb: 2,
                color: "#e0e7ff",
                background: "rgba(255, 255, 255, 0.12)",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: {
                  xs: "1.8rem",
                  md: "2.5rem",
                },
                mb: 1.5,
                lineHeight: 1.2,
              }}
            >
              Administrator Hub & Control Center
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(224, 231, 255, 0.9)",
                fontSize: "1rem",
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Welcome back, <strong>{user?.name}</strong>. As an Administrator,
              your role encompasses reviewing user submissions, overseeing
              public events, moderating users, and publishing verified events
              with immediate approval.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <Button
                component={Link}
                href="/admin/pending"
                variant="contained"
                startIcon={<PendingActionsIcon />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#312e81",
                  fontWeight: 800,
                  px: 2.5,
                  py: 1.2,
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                  },
                }}
              >
                Review Pending ({adminStats.pendingCount})
              </Button>

              <Button
                component={Link}
                href="/events"
                variant="outlined"
                startIcon={<TuneIcon />}
                sx={{
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Manage Events
              </Button>

              <Button
                component={Link}
                href="/create-event"
                variant="outlined"
                startIcon={<AddCircleIcon />}
                sx={{
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Publish New Event
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Statistics */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 2.5,
            color: "#0f172a",
          }}
        >
          Platform Statistics
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Events */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              sx={{
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(79, 70, 229, 0.1)",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EventIcon sx={{ fontSize: 32 }} />
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    {adminStats.eventsCount}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Active Approved Events
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              sx={{
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(245, 158, 11, 0.1)",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PendingActionsIcon sx={{ fontSize: 32 }} />
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    {adminStats.pendingCount}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Awaiting Review
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Users */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              sx={{
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 32 }} />
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    {adminStats.usersCount}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Registered Users
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Administrative Tools */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 2.5,
            color: "#0f172a",
          }}
        >
          Administrative Tools
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Manage Events */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Card
              sx={{
                p: 3,
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                height: "100%",
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
                <EditNoteIcon color="primary" />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Manage & Edit Events
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2.5,
                  flex: 1,
                }}
              >
                View all published events on the platform. Edit event
                information, update seating capacities, or remove expired
                events.
              </Typography>

              <Button
                component={Link}
                href="/events"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: 2,
                }}
              >
                Go to Events
              </Button>
            </Card>
          </Grid>

          {/* Users */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Card
              sx={{
                p: 3,
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                height: "100%",
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
                <PeopleIcon color="secondary" />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Supervise Users
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2.5,
                  flex: 1,
                }}
              >
                Inspect the directory of registered users. Promote users to
                Admin role, modify accounts, or purge inappropriate profiles.
              </Typography>

              <Button
                component={Link}
                href="/admin/users"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: 2,
                }}
              >
                Go to Users
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Preview */}
        {adminStats.pendingCount > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3.5,
              border: "1px solid #fed7aa",
              bgcolor: "#fffbeb",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <PendingActionsIcon sx={{ color: "#d97706" }} />

                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "#92400e",
                    }}
                  >
                    Action Required: {adminStats.pendingCount} Submissions
                    Waiting for Review
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#b45309",
                    }}
                  >
                    Users have submitted events that require your review and
                    approval before they appear publicly.
                  </Typography>
                </Box>
              </Box>

              <Button
                component={Link}
                href="/admin/pending"
                variant="contained"
                sx={{
                  bgcolor: "#d97706",
                  color: "#fff",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#b45309",
                  },
                }}
              >
                Review Submissions
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    );
  }

  // =========================================================
  // REGULAR USER / GUEST HOME
  // =========================================================

  return (
    <Box>
      {/* HERO */}
      <Box
        sx={{
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #4338ca 100%)",
          color: "#fff",
          py: {
            xs: 6,
            md: 9,
          },
          px: {
            xs: 3,
            md: 6,
          },
          mb: 5,
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
        }}
      >
        <Box sx={{ maxWidth: 760 }}>
          <Chip
            label="EXPLORE • CONNECT • ATTEND"
            sx={{
              mb: 2.5,
              color: "#c7d2fe",
              background: "rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "1px",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "2.4rem",
                sm: "3.2rem",
                md: "4.2rem",
              },
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              mb: 2.5,
            }}
          >
            Discover Incredible Events Happening Around You
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: {
                xs: "1rem",
                md: "1.15rem",
              },
              lineHeight: 1.8,
              maxWidth: 620,
              mb: 4,
            }}
          >
            Join thousands of attendees in tech conferences, creative workshops,
            business networking, and sports events. Find your next experience or
            host your own.
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <Button
              component={Link}
              href="/events"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#ffffff",
                color: "#4338ca",
                px: 3.5,
                py: 1.4,
                fontWeight: 800,
                borderRadius: 2.5,
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
              }}
            >
              Explore All Events
            </Button>

            <Button
              component={Link}
              href="/create-event"
              variant="outlined"
              size="large"
              startIcon={<AddCircleIcon />}
              sx={{
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.4)",
                px: 3,
                py: 1.4,
                fontWeight: 700,
                borderRadius: 2.5,
                "&:hover": {
                  borderColor: "#ffffff",
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Host An Event
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Events */}
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card
            sx={{
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <EventIcon
                sx={{
                  fontSize: 36,
                  color: "primary.main",
                  mb: 1,
                }}
              />

              <Typography variant="h4" fontWeight={900}>
                {events.length}+
              </Typography>

              <Typography color="text.secondary" fontWeight={600}>
                Live Approved Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Categories */}
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card
            sx={{
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <CategoryIcon
                sx={{
                  fontSize: 36,
                  color: "primary.main",
                  mb: 1,
                }}
              />

              <Typography variant="h4" fontWeight={900}>
                {categories.length > 0 ? categories.length : "0"}+
              </Typography>

              <Typography color="text.secondary" fontWeight={600}>
                Event Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendees */}
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card
            sx={{
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <GroupsIcon
                sx={{
                  fontSize: 36,
                  color: "primary.main",
                  mb: 1,
                }}
              />

              <Typography variant="h4" fontWeight={900}>
                1,500+
              </Typography>

              <Typography color="text.secondary" fontWeight={600}>
                Active Community Attendees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
            Popular Categories
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat._id}
                label={cat.name}
                component={Link}
                href={`/events?category=${cat._id}`}
                clickable
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* FEATURED EVENTS */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={900}>
              Featured Events
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Handpicked upcoming gatherings you don&apos;t want to miss
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/events"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 700 }}
          >
            View All
          </Button>
        </Box>

        {featuredEvents.length === 0 ? (
          <Card
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              No events published yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 2,
              }}
            >
              Be the first to create an event for your community.
            </Typography>

            <Button component={Link} href="/create-event" variant="contained">
              Create First Event
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {featuredEvents.map((event) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                key={event._id}
              >
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
                  <CardMedia
                    component="img"
                    height="190"
                    image={
                      event.image ||
                      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"
                    }
                    alt={event.title}
                    sx={{
                      bgcolor: "#f1f5f9",
                    }}
                  />

                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Category */}
                    <Box sx={{ mb: 1.5 }}>
                      <Chip
                        label={event.category?.name || "General"}
                        size="small"
                        color="primary"
                        sx={{
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        mb: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </Typography>

                    {/* Date / Location */}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "#64748b",
                        mb: 2,
                      }}
                    >
                      📅 {formatDate(event.date)} • 📍 {event.location}
                    </Typography>

                    {/* Button */}
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        component={Link}
                        href={`/events/${event._id}`}
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                        }}
                      >
                        View Event Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* CTA */}
      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 4,
            md: 5,
          },
          borderRadius: 4,
          background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
          textAlign: "center",
          border: "1px solid #c7d2fe",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            mb: 1,
            color: "#1e1b4b",
          }}
        >
          Have an Event to Share with the Community?
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 580,
            mx: "auto",
            mb: 3,
          }}
        >
          Easily submit your event to our directory. Once verified, attendees
          can explore and register immediately.
        </Typography>

        <Button
          component={Link}
          href="/create-event"
          variant="contained"
          size="large"
          startIcon={<AddCircleIcon />}
          sx={{
            borderRadius: 2.5,
            px: 3.5,
            fontWeight: 800,
          }}
        >
          Create Your Event
        </Button>
      </Paper>
    </Box>
  );
}
