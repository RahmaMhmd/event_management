const Registration = require("../models/Registration");
const Event = require("../models/Event");

// Register for an event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event"
      });
    }

    const registrationsCount = await Registration.countDocuments({
      event: eventId
    });

    if (registrationsCount >= event.seats) {
      return res.status(400).json({
        message: "No seats available"
      });
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId
    });

    res.status(201).json({
      message: "Registered for event successfully",
      registration
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register for event",
      error: error.message
    });
  }
};

// Get my registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id
    })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: registrations.length,
      registrations
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get registrations",
      error: error.message
    });
  }
};

// Cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found"
      });
    }

    await registration.deleteOne();

    res.status(200).json({
      message: "Registration cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel registration",
      error: error.message
    });
  }
};

// Admin: get registrations for an event
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const registrations = await Registration.find({
      event: eventId
    })
      .populate("user", "name email")
      .populate("event", "title date location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: registrations.length,
      registrations
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get event registrations",
      error: error.message
    });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations
};