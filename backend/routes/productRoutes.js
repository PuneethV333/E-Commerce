const express = require('express');
const router = express.Router();
const { getProduct, getProductById, addNewProd, addReview } = require('../controllers/productControllers');
const verifyToken = require('../middleware/verifyToken');

router.get('/', getProduct);
router.get('/:id', getProductById);
router.post('/add', addNewProd);
router.post("/addreview/:id", verifyToken, addReview);

module.exports = router;
