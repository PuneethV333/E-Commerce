
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const mongooseConnect = require("./db/connectdb");
require("./firebaseAdmin"); 
const User = require("./models/user");


const prodRoute = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const bookRoutes = require("./routes/bookRoutes");


mongooseConnect();
const app = express();


app.use(cors({ origin: process.env.REACT_SERVER || true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/prod", prodRoute);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/book", bookRoutes);


app.get("/", (req, res) => res.send("✅ Server is running..."));


cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    const result = await User.updateMany(
      {
        "orderedProd.expectedDeliveryDate": { $lte: today },
        "orderedProd.isDelivered": false,
      },
      {
        $set: { "orderedProd.$[elem].isDelivered": true },
      },
      {
        arrayFilters: [
          { "elem.expectedDeliveryDate": { $lte: today }, "elem.isDelivered": false },
        ],
      }
    );
    console.log(`✅ Delivery status cron updated:`, result.modifiedCount);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
