const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getPendingEvents,
  approveEvent,
  rejectEvent
} = require("../controllers/eventController");

const protect = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public Routes
// Get all approved events
router.get("/", getEvents);

// Admin Routes
// Get pending events
router.get(
  "/admin/pending",
  protect,
  adminOnly,
  getPendingEvents
);

// Approve event
router.patch(
  "/admin/:id/approve",
  protect,
  adminOnly,
  approveEvent
);

// Reject event
router.patch(
  "/admin/:id/reject",
  protect,
  adminOnly,
  rejectEvent
);
// Get event by ID
router.get("/:id", getEventById);

// Create Event
router.post("/", protect, createEvent);

// Admin Only
// Update event
router.put(
  "/:id",
  protect,
  adminOnly,
  updateEvent
);

// Delete event
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);


module.exports = router;