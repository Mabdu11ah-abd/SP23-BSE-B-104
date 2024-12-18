const express = require('express');
const mongoose = require('mongoose');
const router = express();
const authorization = require("../middleware/adminMiddleware");;
const productModel = require('../models/product.model'); // Import product model
const UserModel = require('../models/user.model'); // Assuming the User model exists
const OrderModel = require('../models/order.model');


router.get('/', (req,res)=>{
    return res.render("cart");
})

// ADD TO CART
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const productObjectId = new mongoose.Types.ObjectId(productId);
    
    // Validate product exists in the database
    const product = await productModel.findById(productObjectId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get the current user ID from session
    const userId = req.session.user._id;  // Ensure user is logged in

    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Get the current cart from cookies, or initialize an empty cart if none exists
    let cart = req.cookies[`cart-${userId}`] ? JSON.parse(req.cookies[`cart-${userId}`]) : [];

    // Check if the product already exists in the cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1; // Update quantity
    } else {
      cart.push({ id: productId, quantity: quantity || 1 }); // Add new product to cart
    }

    // Set the updated cart back in the cookie with the user-specific key
    res.cookie(`cart-${userId}`, JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }); // 7 days expiry
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CART DETAILS
router.get('/api/cart',async (req, res) => {
  try {
    // Ensure user is authenticated
    const userId = req.session.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Get the cart from the user-specific cookie
    const cart = req.cookies[`cart-${userId}`] ? JSON.parse(req.cookies[`cart-${userId}`]) : [];

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


router.post('/checkout', async (req, res) => {
  try {
    const userId = req.session.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    // Get the cart from the user-specific cookie
    const cart = req.cookies[`cart-${userId}`] ? JSON.parse(req.cookies[`cart-${userId}`]) : [];
    if (!cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch product details and calculate the total price
    let totalPrice = 0;
    const productsWithDetails = [];

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

    // Create the order
    const order = new OrderModel({
      user: userId,
      products: productsWithDetails,
      totalPrice: totalPrice,
      address: address // Add the address field here
    });

    // Save the order to the database
    await order.save();

    // Clear the cart from the cookie after checkout
    res.clearCookie(`cart-${userId}`);

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Error during checkout' });
  }
});

router.post('/clear', (req, res) => {
  try {
    console.log("hi");
    const userId = req.session.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Clear the user-specific cart cookie
    res.clearCookie(`cart-${userId}`);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});
// REMOVE ITEM FROM CART
router.post('/remove/:id', (req, res) => {
  try {
    const userId = req.session.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Get the cart from the user-specific cookie
    let cart = req.cookies[`cart-${userId}`] ? JSON.parse(req.cookies[`cart-${userId}`]) : [];

    // Find and remove the item from the cart by matching the product ID
    const itemId = req.params.id;
    const updatedCart = cart.filter(item => item.id !== itemId);

    // Update the cookie with the modified cart
    res.cookie(`cart-${userId}`, JSON.stringify(updatedCart), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

    res.status(200).json({ message: 'Item removed successfully', cart: updatedCart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});



module.exports = router;
