  const mongoose = require("mongoose");

  const prodSchema = new mongoose.Schema({
    prodName: { type: String, required: true },
    rating: { type: Number, default: 5 },
    prodType: String,
    prodDescription: String,
    isInStock: { type: Boolean, default: false },
    cost:Number,
    prodImg:{
      type:String,
      required:true
  },
    reviews: [
      {
        userInfo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        review: String,
        date: { type: Date, default: Date.now },
      },
    ],
  });

  module.exports = mongoose.model("Product", prodSchema);
