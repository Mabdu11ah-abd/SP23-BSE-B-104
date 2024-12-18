const express = require("express");
let router = express.Router();
let Category = require("../../models/category.model")
const upload = require("../../multer");


// Get all categories
router.get("/categories", async (req, res) => {
  let categories = await Category.find();
  return res.render("admin/categories", {
    layout: "adminlayout",
    pageTitle: "Manage Shan Categories",
    categories,
  });
});

// Render form to create a category
router.get("categories/create", (req, res) => {
  return res.render("admin/categories-form", { layout: "adminlayout" });
});

router.post(
  '/categories/create',
  upload.single('image'), // Use multer middleware to handle file upload
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      console.log(req.file.path);
      // Save the category to the database
      const newCategory = new Category({
        name: req.body.name,
        description: req.body.description,
        image: req.file.path 
      });
      console.log(newCategory);
      await newCategory.save();

      return res.redirect('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      return res.status(500).send('An error occurred while creating the category.');
    }
  }
);


// Delete a category
router.get("/categories/delete/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/categories");
});

// Render form to edit a category
router.get("/categories/edit/:id", async (req, res) => {
  let category = await Category.findById(req.params.id);
  return res.render("admin/categories-edit-form", {
    layout: "adminlayout",
    category,
  });
});

// Handle category edit with file upload
router.post(
  '/categories/edit/:id',
  upload.single('image'), // Handle optional image upload
  async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).send('Category not found.');
      }

      // Update the fields from the request
      category.name = req.body.name;
      category.description = req.body.description;

      // Replace image if a new file is uploaded
      if (req.file) {
        category.image = req.file.path; // Updated with Cloudinary file path
      }

      await category.save();

      return res.redirect('/categories');
    } catch (error) {
      console.error('Error editing category:', error);
      return res.status(500).send('An error occurred while updating the category.');
    }
  }
);

module.exports = router;