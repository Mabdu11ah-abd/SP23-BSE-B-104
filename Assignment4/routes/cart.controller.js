const express = require('express');
const mongoose = require('mongoose');
const router = express();
const productModel = require('../models/product.model'); // Import product model
const UserModel = require('../models/user.model'); // Assuming the User model exists
const OrderModel = require('../models/order.model');


router.get('/cart', (req,res)=>{
    return res.render("cart");
})

// ADD TO CART
// ADD TO CART
router.post('/cart/add', async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const productObjectId = new mongoose.Types.ObjectId(productId);
      
      // Validate product exists in the database
      const product = await productModel.findById(productObjectId);
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
    console.log('CART IS WORKING');
    console.log(req.session.user)
    // Get the cart from cookies;
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

// Checkout method
router.post('/cart/checkout', async (req, res) => {
    console.log(req.session.user);

  try {
    // Get the user from the session or request (assuming user is authenticated)
    
    console.log("this is my user:" );
    console.log( req.session.user)
    const userId = req.session.user._id;
    // Replace with actual user authentication
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Get the cart from cookies
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    if (!cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch product details from the database and calculate total price
    let totalPrice = 0;
    const productsWithDetails = [];

    // Loop through each product in the cart
    for (let item of cart) {
      const product = await productModel.findById(item.id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.id} not found` });
      }

      const productTotal = product.price * item.quantity;
      totalPrice += productTotal;

      productsWithDetails.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create an order
    const order = new OrderModel({
      user: userId,
      products: productsWithDetails,
      totalPrice: totalPrice
    });

    // Save the order to the database
    await order.save();

    // Clear the cart from the cookies
    res.clearCookie('cart');

    // Respond with success
    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Error during checkout' });
  }
});
router.post('/cart/clear', (req, res) => {
    try {
      // Clear the cart cookie
      res.clearCookie('cart');  // This will remove the cart cookie
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Server error while clearing cart' });
    }
  });

module.exports = router;
