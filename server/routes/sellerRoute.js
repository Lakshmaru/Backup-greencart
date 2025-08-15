// routes/sellerRoute.js
import express from "express";
import authSeller from "../middlewares/authSeller.js";
import {
  sellerLogin,
  isSellerAuth,
  sellerLogout,
} from "../controllers/sellerController.js";
import { addProduct } from "../controllers/productController.js";
import { upload } from "../configs/multer.js";

const router = express.Router();

router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, isSellerAuth);
router.post("/logout", sellerLogout);

// ✅ Final unified product upload route
router.post(
  "/add-product",
  authSeller,
  upload.array("images", 5),
  addProduct
);

export default router;
