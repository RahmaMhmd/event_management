const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You are authorized",
    user: req.user
  });
});

module.exports = router;