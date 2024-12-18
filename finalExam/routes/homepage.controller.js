const express = require("express");
const admin = require("../middleware/adminMiddleware");
router = express()
router.get("/admin/products", admin, (req,res)=>{
    return res.render("admin/products");
}
)
router.get("/", (req, res) => {
    return res.render("index2");
  });


module.exports = router;