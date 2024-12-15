const express = require("express");
let router = express.Router();
let Category = require("../../models/category.model")


router.get("/admin/categories", async (req, res) => {
    let categories = await Category.find();
    return res.render("admin/categories", {
      layout: "adminlayout",
      pageTitle: "Manage Shan  Categories",
      categories
    });
  });

  router.get("/admin/categories/create", (req, res) => {
    return res.render("admin/categories-form", { layout: "adminlayout" });
  });

  router.post("/admin/categories/create", async (req, res) => {
    let data = req.body;
    let newCategory = new Category(data);
    newCategory.title = data.title;
    await newCategory.save();
    return res.redirect("/admin/categories");
  });

router.get("/admin/categories/delete/:id", async(req,res)=>{
    let params = req.params;
    let categories = await Category.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/categories");
})

router.get("/admin/categories/edit/:id", async (req, res) => {
    let categories = await Category.findById(req.params.id);
    return res.render("admin/categories-edit-form", {
      layout: "adminlayout",
      Category: categories,
    });
});

router.post("/admin/categories/edit/:id", async (req, res) => {
    let category = await Category.findById(req.params.id);
    category.title = req.body.title;
    category.description = req.body.description;
    category.price = req.body.price;
    await category.save();
    return res.redirect("/admin/categories");
  });

module.exports = router;