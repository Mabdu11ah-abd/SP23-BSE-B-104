const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");
let Category = require("../../models/category.model");
let OrderModel = require("../../models/order.model");

// Admin - View Orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user")
      .populate("products.product");
       console.log(orders);

    res.render("admin/admin-order", {
      layout: "adminLayout",
      pageTitle: "Products creation",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
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
      res.render("admin/admin-order-details", {
        layout: "adminLayout",
        pageTitle: "Order Details",
        order,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).send("Error fetching order details");
    }
  });

  router.get("/orders/:id/edit", async (req, res) => {
    try {
      const order = await OrderModel.findById(req.params.id);
  
      if (!order) {
        return res.status(404).send("Order not found");
      }
      console.log(order);
       
      res.render("admin/admin-order-edit", {
        layout: "adminLayout",
        pageTitle: "Edit Order Status",
        order,
      });
    } catch (error) {
      console.error("Error fetching order for editing:", error);
      res.status(500).send("Error fetching order for editing");
    }
  });
  
  router.post("/orders/:id/edit", async (req, res) => {
    try {
      const { status } = req.body;
  
      const order = await OrderModel.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).send("Order not found");
      }
  
      res.redirect("/admin/orders");
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send("Error updating order status");
    }
  });
  
module.exports = router;
