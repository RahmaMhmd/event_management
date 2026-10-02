const Category = require("../models/Category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.trim()
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message
    });
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get categories",
      error: error.message
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory
};