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
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { getEvents, getPendingEvents, getUsers } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isAdmin, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: 0,
    users: 0,
    pending: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const [eventsData, usersData, pendingData] = await Promise.all([
          getEvents().catch(() => ({ events: [], count: 0 })),
          getUsers(token).catch(() => ({ users: [], count: 0 })),
          getPendingEvents(token).catch(() => ({ events: [], count: 0 })),
        ]);

        setStats({
          events: eventsData.count || eventsData.events?.length || 0,
          users: usersData.count || usersData.users?.length || 0,
          pending: pendingData.count || pendingData.events?.length || 0,
        });
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push("/");
        return;
      }
      loadDashboard();
    }
  }, [user, isAdmin, authLoading, token, router]);

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
      {/* Top Banner */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 38, color: "secondary.main" }} />
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-1px" }}>
            Admin Management Console
          </Typography>
        </Box>
        <Typography color="text.secondary" variant="body1">
          Monitor key system metrics, review submitted events, oversee attendees, and manage events catalog.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPI Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Live Approved Events"
            value={stats.events}
            icon={<EventIcon sx={{ fontSize: 28 }} />}
            color="#4f46e5"
            link="/events"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Pending Event Approvals"
            value={stats.pending}
            icon={<PendingActionsIcon sx={{ fontSize: 28 }} />}
            color="#d97706"
            link="/admin/pending"
            badge={stats.pending > 0 ? "Requires Action" : "All Clear"}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Registered Users"
            value={stats.users}
            icon={<PeopleIcon sx={{ fontSize: 28 }} />}
            color="#059669"
            link="/admin/users"
          />
        </Grid>
      </Grid>

      {/* Quick Launchpad Cards */}
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2.5 }}>
        Quick Management Tools
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Review Pending Event Submissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
              Users submit events to be verified. Inspect their details, date, seating, and decide to approve or reject them.
            </Typography>
            <Button
              component={Link}
              href="/admin/pending"
              variant="contained"
              sx={{ alignSelf: "flex-start", borderRadius: 2, bgcolor: "#d97706", "&:hover": { bgcolor: "#b45309" } }}
              endIcon={<ArrowForwardIcon />}
            >
              Open Pending Approvals ({stats.pending})
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              User Directory & Role Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
              Promote members to administrator role, inspect user registration records, or remove inactive accounts.
            </Typography>
            <Button
              component={Link}
              href="/admin/users"
              variant="contained"
              color="secondary"
              sx={{ alignSelf: "flex-start", borderRadius: 2 }}
              endIcon={<ArrowForwardIcon />}
            >
              Manage Users ({stats.users})
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Edit & Modify Events Catalog
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
              Access full edit and delete controls over all approved community events.
            </Typography>
            <Button
              component={Link}
              href="/events"
              variant="outlined"
              sx={{ alignSelf: "flex-start", borderRadius: 2, fontWeight: 700 }}
              endIcon={<ArrowForwardIcon />}
            >
              Go to Events
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Publish Official Event
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
              Create an event as an administrator. It skips review and publishes directly to the public feed.
            </Typography>
            <Button
              component={Link}
              href="/create-event"
              variant="contained"
              startIcon={<AddCircleIcon />}
              sx={{ alignSelf: "flex-start", borderRadius: 2 }}
            >
              Create New Event
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function StatCard({ title, value, icon, color, link, badge }) {
  return (
    <Card
      component={Link}
      href={link}
      sx={{
        textDecoration: "none",
        height: "100%",
        display: "block",
        borderRadius: 3.5,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          {badge && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: color,
                bgcolor: `${color}15`,
                px: 1.2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              {badge}
            </Typography>
          )}
        </Box>

        <Typography variant="h3" fontWeight={900} sx={{ color: "#0f172a", mb: 0.5 }}>
          {value}
        </Typography>

        <Typography color="text.secondary" variant="body2" fontWeight={600}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}