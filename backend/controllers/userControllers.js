const User = require("../models/user");

// 🧩 Helper to create a new user
const createUser = async ({ email, userName, firebaseUid }) => {
  const existingUser = await User.findOne({ firebaseUid });
  if (existingUser) return null;

  const newUser = new User({
    firebaseUid,
    userName,
    email,
  });
  await newUser.save();
  return newUser;
};

// 📩 Sign up via Email
const signUpViaEmail = async (req, res) => {
  try {
    const { email, firebaseUid, userName } = req.body;

    if (!email || !firebaseUid || !userName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await createUser({ email, userName, firebaseUid });
    if (!user)
      return res.status(400).json({ message: "User already exists" });

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Server error adding user" });
  }
};

// 🔵 Sign in via Google
const viaGoogle = async (req, res) => {
  try {
    const { email, userName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !userName)
      return res.status(400).json({ message: "All fields are required" });

    let user = await User.findOne({ firebaseUid })
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo");

    if (!user) {
      user = await createUser({ email, userName, firebaseUid });
    }

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding Google user:", err);
    res.status(500).json({ message: "Server error adding Google user" });
  }
};

// 🙋‍♂️ Get Current User (/api/user/me)
const getUserMe = async (req, res) => {
  try {
    const { firebaseUid } = req.user;

    if (!firebaseUid)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ firebaseUid })
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

// 👥 Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo");

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Sign In via Email
const signInViaEmail = async (req, res) => {
  try {
    const firebaseUid = req.user?.firebaseUid || req.body.firebaseUid;

    if (!firebaseUid)
      return res.status(400).json({ message: "Firebase UID missing" });

    const user = await User.findOne({ firebaseUid })
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

module.exports = {
  signUpViaEmail,
  signInViaEmail,
  viaGoogle,
  getUserMe,
  getAllUsers,
};
