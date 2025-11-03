const mongoose = require("mongoose");

// 🧾 Schema for ordered products
const orderedProdSchema = new mongoose.Schema(
  {
    productInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: true,
      trim: true,
    },
    expectedDeliveryDate: {
      type: Date,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🛒 Schema for cart products
const cartSchema = new mongoose.Schema(
  {
    productInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productQuan: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
  },
  { timestamps: true }
);

// 👤 Main User Schema
const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cartProduct: [cartSchema],
    orderedProd: [orderedProdSchema],
    deliveredProd: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
