const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const user = mongoose.model("users", userSchema);

module.exports = user;
