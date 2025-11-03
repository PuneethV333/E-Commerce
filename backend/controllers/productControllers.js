const Product = require("../models/product");

const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addNewProd = async (req, res) => {
  try {
    const { prodName, image, cost, description, type } = req.body;

    const existingProduct = await Product.findOne({ prodName: prodName });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const newProduct = new Product({
      prodName,
      prodType: type,
      prodDescription: description,
      cost,
      prodImg: image,
    });

    await newProduct.save();

    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { getProduct, getProductById, addNewProd };
