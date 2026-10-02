const express = require("express");

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations
} = require("../controllers/registrationController");

const protect = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

// User
router.post("/:eventId", protect, registerForEvent);

router.get("/my", protect, getMyRegistrations);

router.delete("/:eventId", protect, cancelRegistration);

// Admin
router.get(
  "/event/:eventId",
  protect,
  adminOnly,
  getEventRegistrations
);

module.exports = router;