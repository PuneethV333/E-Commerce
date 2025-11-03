const express = require('express');
const router = express.Router();
const { addtoCart,updateQuantity,removeFromCart } = require('../controllers/cartControllers');
const verifyToken = require('../middleware/verifyToken');

router.post('/add', verifyToken, addtoCart);
router.post('/update', verifyToken, updateQuantity);
router.post('/remove', verifyToken, removeFromCart);


module.exports = router;
