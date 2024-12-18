const express = require('express');
const router = express.Router();
const product = require('../models/product.model'); // Import product model
const CategoryModel = require('../models/category.model');

// GET PRODUCTS WITH FILTER, SEARCH, SORTING
// GET ALL PRODUCTS with filtering
// GET PRODUCTS WITH FILTERING
router.get('/api/products', async (req, res) => {
  console.log("api is called")
  try {

    console.log("error over here");
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
    const totalRecords = await product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Fetch the products based on filter, sort, pagination
    const products = await product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip((page - 1) * pageSize).populate('category');

    console.log(products);
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


router.get("/", (req, res) => {
  console.log("shoppage called")
    return res.render("shopPage"); // Render the shopPage view
});

module.exports = router;