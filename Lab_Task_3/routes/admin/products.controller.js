const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");

router.get("/admin/products", async (req, res) => {
    let products = [{
        title:"BOOK",
        description: "BERY BIG BOOK",
        price: 50,
    }]
    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Shan Foods",
      products,
    });
  });
  router.get("/admin/products/create", (req, res) => {
    return res.render("admin/product-form", { layout: "adminlayout" });
  });

  router.post("/admin/products/create", async (req, res) => {
    let data = req.body;
    let newProduct = new Product(data);
    newProduct.title = data.title;
    await newProduct.save();
    return res.redirect("/admin/products");
    // we will send data to model to save in db
  
    // return res.send(newProduct);
    // return res.render("admin/product-form", { layout: "adminlayout" });
  });

module.exports = router;