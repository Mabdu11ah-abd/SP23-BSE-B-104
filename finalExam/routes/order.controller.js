const express = require("express");
let router = express.Router();
let Product = require("../models/product.model");
let Category = require("../models/category.model");
let OrderModel = require("../models/order.model");

// Admin - View Orders
// Admin - View Orders (Only for logged-in user)
router.get("/orders", async (req, res) => {
  try {
    // Assuming `req.user` contains the logged-in user's data
    const userId = req.session.user._id;

    // Fetch orders only for the logged-in user
    const orders = await OrderModel.find({ "user": userId })
      .populate("user")
      .populate("products.product");

    console.log(orders);

    res.render("userOrder", {
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).send("Error fetching user orders");
  }
});


router.get("/orders/:id", async (req, res) => {
    console.log("Orders entered");
    try {
      const order = await OrderModel.findById(req.params.id)
        .populate("user")
        .populate("products.product");
        console.log(order);
      if (!order) {
        return res.status(404).send("Order not found");
      }
      console.log(order);
      res.render("user-order-details", {
        order,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).send("Error fetching order details");
    }
  });


module.exports = router;
