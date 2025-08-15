import User from '../models/User.js';

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Get userId from auth middleware
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: "cartItems are required and must be an array" });
    }

    // Optional: Validate each cart item structure
    if (
      cartItems.length > 0 &&
      !cartItems.every(item => item.productId && typeof item.quantity === 'number' && item.quantity >= 0)
    ) {
      return res.status(400).json({ success: false, message: "Invalid cartItems item structure" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cartItems } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Cart Updated", data: user.cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
