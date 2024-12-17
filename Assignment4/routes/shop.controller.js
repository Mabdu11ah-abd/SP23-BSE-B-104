const express = require('express');
const router = express.Router();
const productModel = require('../models/product.model'); // Import product model

// GET ALL PRODUCTS
router.get('/api/products', async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Render the shop page
router.get("/shop", (req, res) => {
    return res.render("shopPage"); // Render the shopPage view
});

module.exports = router;
