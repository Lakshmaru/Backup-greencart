// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: Array, default: [] }, // you send description as array
  category: { type: String },
  price: { type: Number },
  offerPrice: { type: Number },
  images: { type: [String], default: [] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
