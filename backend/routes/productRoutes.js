const express = require('express');
const router = express.Router();
const { getProduct, getProductById, addNewProd } = require('../controllers/productControllers');

router.get('/', getProduct);
router.get('/:id', getProductById);
router.post('/add', addNewProd);

module.exports = router;
