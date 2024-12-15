const mongoose = require("mongoose");

let CategorySchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

let CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
