const User = require("../models/user");
const Product = require("../models/product");
const twilio = require("twilio");


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const bookProduct = async (req, res) => {
  const { productId } = req.params;
  const { loc, phno, fullname } = req.body;
  console.log("TWILIO SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO TOKEN:", process.env.TWILIO_AUTH_TOKEN);


  if (!productId)
    return res.status(400).json({ message: "Product ID is required" });
  if (!loc || !phno || !fullname)
    return res
      .status(400)
      .json({ message: "Location, phone, and fullname are required" });

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
    if (!user) return res.status(401).json({ message: "User not found" });

    const order = {
      productInfo: product._id,
      deliveryLocation: loc,
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      contactInfo: phno,
      isDelivered: false,
    };

    user.orderedProd.push(order);
    await user.save();

    let smsStatus = "SMS sent successfully!";
    try {
      await client.messages.create({
        to: phno.startsWith("+") ? phno : `+91${phno}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Hi ${fullname}, your order for "${
          product.prodName
        }" is confirmed! Expected delivery: ${order.expectedDeliveryDate.toDateString()}.`,
      });
    } catch (smsErr) {
      console.error("SMS sending failed:", smsErr);
      smsStatus = "SMS failed to send.";
    }

    return res.status(200).json({
      message: "Booking successful",
      order,
      smsStatus,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ message: "Server error while booking" });
  }
};

module.exports = bookProduct;
