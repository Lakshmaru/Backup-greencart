import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // Check if token belongs to the configured seller
    if (decoded?.email !== process.env.SELLER_EMAIL) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    // Attach seller info to request
    req.sellerEmail = decoded.email;

    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, message });
  }
};

export default authSeller;
