const mongoose = require("mongoose");

// Order Schema
let orderSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Products',  // Match the name from product model
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true,
        min: 1
      },
      price: { 
        type: Number, 
        required: true
      }
    }
  ],
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  }
});

let orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
