const express = require("express");
const expressLayouts = require("express-ejs-layouts"); // Make sure this matches throughout the code
const mongoose = require("mongoose");
let server = express();
server.set("view engine", "ejs");

server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.use(express.urlencoded());
server.get("/", (req, res) => {
  return res.send(res.render("HomePage"));
});
server.get("/", (req,res)=>{
  return res.send(res.render(""))
})
mongoose.connect("mongodb+srv://iamabdullahforu:PsYR3xIqCaxlSZ5v@shanfoodsproject.gwpek.mongodb.net/?retryWrites=true&w=majority&appName=ShanFoodsProject")
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection failed:", err.message);
})

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
