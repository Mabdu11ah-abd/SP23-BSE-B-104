const mongoose = require("mongoose");

let productSchema = mongoose.Schema
({
    title:String,
    description: String,
    price: Number,
    category:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }  
});
productSchema.index({ title: "text", description: "text" });

let productModel = mongoose.model("Products", productSchema);

module.exports = productModel;