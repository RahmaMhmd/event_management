const express = require("express");

const {
  createCategory,
  getCategories,
  deleteCategory
} = require("../controllers/categoryController");

const protect = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getCategories);

// Admin
router.post("/", protect, adminOnly, createCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;