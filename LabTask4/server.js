
const express = require("express");
const expressLayouts = require("express-ejs-layouts"); // Make sure this matches throughout the code
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

let server = express();
server.set("view engine", "ejs");

server.use(expressLayouts);

server.use(express.static("public"));


server.use(express.urlencoded({ extended: true }));
let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);
let adminCategoreisRouter = require("./routes/admin/categories.controller");
server.use(adminCategoreisRouter);

let testrouter = require("./routes/admin/test.controller")
server.use(testrouter);

server.get("/", (req, res) => {
  return res.send(res.render("index2"));
});
//admin panel is accessible at /admin/products

//mongodb connection 
mongoose.connect("mongodb://localhost:27017")
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection failed:", err.message);
})

//starting server
server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
