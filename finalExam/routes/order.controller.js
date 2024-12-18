const express = require('express');
const mongoose = require('mongoose');
const orderModel = require('../models/order.model');  // Import your Order model
const router = express.Router();

// Get Orders for a User
// Inside your route handler
router.get('/api/orders', async (req, res) => {
    try {
        console.log(req.session.user);
        const userId = req.session.user._id;      
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const orders = await orderModel.find({ user: userId });
      console.log(orders); // Log the orders to check if it's an array
  
      if (!Array.isArray(orders)) {
        return res.status(500).json({ message: 'Error: Orders not found' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });
  
console.log("hi");
router.get("/orders", (req,res)=>{
    return res.render("userOrder");
})

module.exports = router;
