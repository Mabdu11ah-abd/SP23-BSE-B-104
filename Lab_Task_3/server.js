const express = require("express");
const expressLayouts = require("express-ejs-layouts"); // Make sure this matches throughout the code

let server = express();
server.set("view engine", "ejs");

server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.get("/", (req, res) => {
  return res.send(res.render("HomePage"));
});

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
