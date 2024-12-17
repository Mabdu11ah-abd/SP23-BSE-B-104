const express = require('express');
const router = express();
const productModel = require('../models/product.model'); // Import product model
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

// ADD TO CART
router.post('/api/cart/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists in the database
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get the current cart from cookies
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    // Check if the product already exists in the cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1; // Update quantity
    } else {
      cart.push({ id: productId, quantity: quantity || 1 }); // Add new product to cart
    }

    // Set the updated cart back in the cookie
    res.cookie('cart', JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }); // 7 days expiry
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CART DETAILS
router.get('/api/cart', async (req, res) => {
  try {
    // Get the cart from cookies
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    if (!cart.length) {
      return res.status(200).json([]); // Return empty cart if no items
    }

    // Fetch product details for each product ID in the cart
    const productIds = cart.map(item => item.id);
    const products = await productModel.find({ _id: { $in: productIds } });

    // Merge product details with quantities
    const cartDetails = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id.toString());
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: cartItem.quantity
      };
    });

    res.status(200).json(cartDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
