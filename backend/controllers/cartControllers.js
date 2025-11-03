const User = require("../models/user");
const Product = require("../models/product");

const addtoCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const firebaseUid = req.user.firebaseUid;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (user.cartProduct.includes(productId)) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    const existingItem = user.cartProduct.find(
      (item) => item.productInfo.toString() === productId
    );

    if (existingItem) {
      existingItem.productQuan += quantity || 1;
    } else {
      user.cartProduct.push({
        productInfo: productId,
        productQuan: quantity || 1,
      });
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate("cartProduct.productInfo")
      .exec();

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const firebaseUid = req.user.firebaseUid;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.cartProduct.find(
      (item) => item.productInfo.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    existingItem.productQuan = quantity;
    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate("cartProduct.productInfo")
      .exec();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating quantity in cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const firebaseUid = req.user.firebaseUid;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.cartProduct.find(
      (item) => item.productInfo.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    const index = user.cartProduct.indexOf(existingItem);
    if (index > -1) {
      user.cartProduct.splice(index, 1);
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate("cartProduct.productInfo")
      .exec();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error while removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addtoCart, updateQuantity, removeFromCart };
