// ✅ Role-based access control
exports.authorize = (allowedRoles = []) => (req, res, next) => {
  try {
    if (!req.user || !req.user.role)
      return res.status(401).json({ message: "Not authorized" });

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });

    next();
  } catch (error) {
    next(error);
  }
};
