const express = require("express");
const expressLayouts = require("express-ejs-layouts"); // Make sure this matches throughout the code
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const admin = require("./middleware/adminMiddleware");
const auth = require("./middleware/authorizationMiddleware");
const siteMiddleware = require("./middleware/siteMiddleware");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });
let server = express();
server.use(express.static("public"));
server.use(express.static("public"));


server.use(express.json()); // This is essential for parsing JSON request bodies
server.set("view engine", "ejs");
server.use(expressLayouts);

let cookieParser = require("cookie-parser");
server.use(cookieParser());


let session = require("express-session");

server.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Ensure it's set as per your environment
}));
server.use(express.urlencoded({ extended: true }));



server.use(siteMiddleware);

let cartRouter = require('./routes/cart.controller');
server.use("/cart",auth, cartRouter);

let adminProductsRouter = require("./routes/admin/products.controller");
server.use('/admin', auth,admin, adminProductsRouter);

let adminCategoreisRouter = require("./routes/admin/categories.controller");
server.use("/admin", auth,admin, adminCategoreisRouter);

let adminOrderRouter = require("./routes/admin/admin-order.controller")
server.use("/admin",auth, admin, adminOrderRouter);


let homePageRouter = require("./routes/homepage.controller");
server.use(homePageRouter);

let authRouter = require("./routes/auth.controller");
server.use(authRouter);

let shopRouter = require("./routes/shop.controller");
server.use("/shop",auth, shopRouter);

let orderRouter = require("./routes/order.controller");
server.use(auth, orderRouter);

//admin panel is accessible at /admin/products
const uri = "mongodb://localhost:27017";
//mongodb connection 
mongoose.connect(uri)
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
