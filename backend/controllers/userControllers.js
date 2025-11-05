const User = require("../models/user");


const createUser = async ({ email, displayName, firebaseUid }) => {
  const existingUser = await User.findOne({ firebaseUid });
  if (existingUser) return null;

  const newUser = new User({
    firebaseUid,
    userName: displayName,
    email,
  });

  await newUser.save();
  return newUser;
};


const signUpViaEmail = async (req, res) => {
  try {
    const { email, firebaseUid, displayName } = req.body;

    if (!email || !firebaseUid || !displayName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await createUser({ email, displayName, firebaseUid });
    if (!user)
      return res.status(400).json({ message: "User already exists" });

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Server error adding user" });
  }
};


const viaGoogle = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;

    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "All fields are required" });

    let user = await User.findOne({ firebaseUid })
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo")
      .populate("deliveredProd");

    if (!user) {
      user = await createUser({ email, displayName, firebaseUid });
    }

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding Google user:", err);
    res.status(500).json({ message: "Server error adding Google user" });
  }
};


const signInViaEmail = async (req, res) => {
  try {
    const firebaseUid = req.user?.firebaseUid || req.body.firebaseUid;

    if (!firebaseUid)
      return res.status(400).json({ message: "Firebase UID missing" });

    const user = await User.findOne({ firebaseUid })
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo")
      .populate("deliveredProd");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};


const getUserMe = async (req, res) => {
  try {
    const { firebaseUid } = req.user;

    if (!firebaseUid)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ firebaseUid })
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo")
      .populate("deliveredProd");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("cartProduct.productInfo")
      .populate("orderedProd.productInfo")
      .populate("deliveredProd");

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signUpViaEmail,
  signInViaEmail,
  viaGoogle,
  getUserMe,
  getAllUsers,
};
