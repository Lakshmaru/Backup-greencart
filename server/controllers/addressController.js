// server/controllers/addressController.js

// Add Address : POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    // If using MongoDB, you could save like:
    // await Address.create({ userId: req.userId, address });

    res.json({
      success: true,
      message: "Address added successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error in addAddress:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

// Get Address : GET /api/address
export const getAddress = async (req, res) => {
  try {
    // If using MongoDB, you could fetch like:
    // const address = await Address.findOne({ userId: req.userId });

    const address = "123 Main Street, Example City"; // temporary mock
    res.json({ success: true, address });
  } catch (error) {
    console.error("Error in getAddress:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
