const express =  require("express");
var expresslayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
console.log(`HI`);
server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.get("/", (req, res) => {
  return res.send(res.render("homepage"));
});
server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});