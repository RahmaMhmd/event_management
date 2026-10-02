const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getUsers);

router.get("/users/:id", getUserById);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;