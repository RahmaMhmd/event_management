const Event = require("../models/Event");
// Create Event
const createEvent = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE EVENT BODY:", req.body);
    console.log("CREATE EVENT USER:", req.user);
    console.log("=================================");

    const {
      title,
      description,
      category,
      date,
      location,
      seats,
      image
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location ||
      !seats
    ) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      seats,
      image,
      status:
        req.user.role === "admin"
          ? "approved"
          : "pending",
      createdBy: req.user.id
    });

    await event.populate("category", "name");
    await event.populate("createdBy", "name email");

    res.status(201).json({
      message:
        req.user.role === "admin"
          ? "Event created successfully"
          : "Event submitted successfully and is waiting for admin approval",
      event
    });
  } catch (error) {
    console.error("=================================");
    console.error("CREATE EVENT ERROR:");
    console.error(error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR NAME:", error.name);
    console.error("=================================");

    res.status(500).json({
      message: "Failed to create event",
      error: error.message
    });
  }
};

// Get All Approved Events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "approved"
    })
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      count: events.length,
      events
    });
  } catch (error) {
    console.error("Get Events Error:", error);

    res.status(500).json({
      message: "Failed to get events",
      error: error.message
    });
  }
};

// Get Event By ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      event
    });
  } catch (error) {
    console.error("Get Event By ID Error:", error);

    res.status(500).json({
      message: "Failed to get event",
      error: error.message
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const {
      title,
      description,
      category,
      date,
      location,
      seats,
      image
    } = req.body;

    event.title =
      title ?? event.title;

    event.description =
      description ?? event.description;

    event.category =
      category ?? event.category;

    event.date =
      date ?? event.date;

    event.location =
      location ?? event.location;

    event.seats =
      seats ?? event.seats;

    event.image =
      image ?? event.image;

    await event.save();

    await event.populate("category", "name");
    await event.populate("createdBy", "name email");

    res.status(200).json({
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("Update Event Error:", error);

    res.status(500).json({
      message: "Failed to update event",
      error: error.message
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    await event.deleteOne();

    res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    res.status(500).json({
      message: "Failed to delete event",
      error: error.message
    });
  }
};

// Admin: Get Pending Events
const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "pending"
    })
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: events.length,
      events
    });
  } catch (error) {
    console.error("Get Pending Events Error:", error);

    res.status(500).json({
      message: "Failed to get pending events",
      error: error.message
    });
  }
};

// Admin: Approve Event
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    event.status = "approved";

    await event.save();

    await event.populate("category", "name");
    await event.populate("createdBy", "name email");

    res.status(200).json({
      message: "Event approved successfully",
      event
    });
  } catch (error) {
    console.error("=================================");
    console.error("APPROVE EVENT ERROR:");
    console.error(error);
    console.error("=================================");

    res.status(500).json({
      message: "Failed to approve event",
      error: error.message
    });
  }
};

// Admin: Reject Event
const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    event.status = "rejected";

    await event.save();

    await event.populate("category", "name");
    await event.populate("createdBy", "name email");

    res.status(200).json({
      message: "Event rejected successfully",
      event
    });
  } catch (error) {
    console.error("=================================");
    console.error("REJECT EVENT ERROR:");
    console.error(error);
    console.error("=================================");

    res.status(500).json({
      message: "Failed to reject event",
      error: error.message
    });
  }
};

// Export Controllers
module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getPendingEvents,
  approveEvent,
  rejectEvent
};