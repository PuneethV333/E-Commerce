const mongoose = require("mongoose");

const mongooseConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("✅ MongoDB Connected Successfully"))
      .catch((err) => console.error("❌ MongoDB Connection Error:", err));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = mongooseConnect;
