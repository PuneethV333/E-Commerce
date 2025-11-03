const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const bookProduct = require("../controllers/bookControllers");
const router = express.Router();

router.post("/:productId", verifyToken, bookProduct);

module.exports = router;