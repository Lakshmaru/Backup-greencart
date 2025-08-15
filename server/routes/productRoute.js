// routes/productRoute.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get all products (both in-stock and out-of-stock)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update stock status
router.patch("/:id/stock", async (req, res) => {
  try {
    const { inStock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock: Boolean(inStock) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: `Stock updated to ${updatedProduct.inStock ? "In Stock" : "Out of Stock"}`,
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating stock" });
  }
});

export default router;
