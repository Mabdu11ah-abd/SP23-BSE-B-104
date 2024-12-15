const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");


router.get("/admin/products/create", (req, res) => {
  console.log("Method called ");
  return res.render("admin/product-form", { layout: "adminlayout" });
});

router.post("/admin/products/create", async (req, res) => {
  let data = req.body;
  let newProduct = new Product(data);
  newProduct.title = data.title;
  await newProduct.save();
  return res.redirect("/admin/products");
});

router.get("/admin/products/delete/:id", async (req, res) => {
  let params = req.params;
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});

router.get("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/product-edit-form", {
    layout: "adminlayout",
    product,
  });
});

router.post("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
});

router.get('/admin/products', async (req, res) => {
  try {
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

router.get("/api/products", async (req, res) => {
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
      .skip((page - 1) * pageSize);

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



module.exports = router;
