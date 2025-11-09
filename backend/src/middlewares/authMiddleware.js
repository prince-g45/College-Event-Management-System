// ===========================================
// ✅ CEPS Middleware — Authentication (Protect)
// ===========================================
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach user data to request
      req.user = await User.findById(decoded.id).select("name email role");

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error("❌ Auth Error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};
