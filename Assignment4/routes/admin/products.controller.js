const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");
let CategoryModel = require("../../models/category.model");
const upload = require("../../multer"); // Assuming multer is configured

router.get("/products/create", async (req, res) => {
  console.log("Method called ");
  try
  {
    const categories = await CategoryModel.find().populate('name');
    res.render("./admin/product-form",{
      layout: "adminLayout",
      pageTitle:"Products creation",
      categories,
    })
  }
  catch(error)
  {
    console.log(error, "in create method")
  } 
});

router.get("/products/delete/:id", async (req, res) => {
  let params = req.params;
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});

router.get("/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/product-edit-form", {
    layout: "adminlayout",
    product,
  });
});


// Add a new product with an image
router.post("/products/create", upload.single('image'), async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? req.file.path : null,  // Store image path if available
    });
    console.log(req.file.path);

    console.log(newProduct);
    await newProduct.save();
    return res.redirect("/admin/products");
  } catch (error) {
    console.log(error, "in create method");
    res.status(500).send("Error creating product");
  }
});

// Edit product with optional image update
router.post("/products/edit/:id", upload.single('image'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Update fields
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      product.image = req.file.path; // Store new image path
    }

    await product.save();
    return res.redirect("/admin/products");
  } catch (error) {
    console.log(error, "in edit method");
    res.status(500).send("Error updating product");
  }
});


router.get('/products', async (req, res) => {
  try {
    console.log("method has been hit")
    const pageTitle = "Admin - Products"; // Set the page title
    res.render('admin/products', { 
      layout: "adminlayout",
      pageTitle: "Manage Shan Foods",
    }); // Render the EJS page with the page title
  } catch (error) {
    console.error("Error rendering products page:", error);
    res.status(500).send("Error rendering products page.");
  }
});

router.get("/api/products/:page?", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Default page size is 5
    const { search, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

    // Build the filter based on query parameters
    const filter = {};
    if (category) filter.category = category;
    if (minPrice && maxPrice) filter.price = { $gte: minPrice, $lte: maxPrice };
    if (search) filter.$text = { $search: search };

    // Build the sort object
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Count the total number of products that match the filter
    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Fetch the products based on filter, sort, pagination
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip((page - 1) * pageSize).populate('category');

    // Respond with the products and pagination data
    res.json({
      products,
      totalRecords,
      totalPages,
      page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});
router.get('/api/categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Assuming you have a Category model
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router;
