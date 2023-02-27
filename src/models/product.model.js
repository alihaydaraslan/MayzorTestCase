const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
    },
    name: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    comment: {
      type: String,
      default: null,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

const product = mongoose.model("products", productSchema);

module.exports = product;
