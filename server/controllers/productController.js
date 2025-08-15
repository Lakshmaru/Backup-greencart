import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../models/Product.js";

// POST /api/seller/add-product
export const addProduct = async (req, res) => {
  try {
    if (!req.body.productData) {
      return res.status(400).json({ success: false, message: "Missing product data" });
    }

    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid product data JSON format" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No product images uploaded" });
    }

    const imagesUrl = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
        imagesUrl.push(result.secure_url);
      } finally {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      }
    }

    await Product.create({ ...productData, images: imagesUrl });

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// PATCH /api/products/:id/stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;

    if (typeof inStock !== "boolean") {
      return res.status(400).json({ success: false, message: "Invalid stock value" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Stock updated", product });
  } catch (error) {
    console.error("Update Stock Error:", error);
    res.status(500).json({ success: false, message: "Failed to update stock" });
  }
};
