const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    products: [
      {
        productId: Number,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Cart",
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
