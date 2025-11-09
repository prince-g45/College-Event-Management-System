// ===========================================
// ✅ CEPS Backend — User Routes (ES6 Fixed)
// ===========================================

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { updateUser, changePassword } from "../controllers/userController.js";

const router = express.Router();

// ✏️ Update user profile (name, email, role)
router.put("/update", protect, updateUser);

// 🔒 Change password
router.put("/change-password", protect, changePassword);

export default router;
