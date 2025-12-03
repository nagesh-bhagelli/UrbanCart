export function requireAdmin(req, res, next) {
  // Check if user is authenticated and is admin
  // In a real app, you'd decode JWT token here
  // For now, we'll check from the body or headers
  const userRole = req.headers["x-user-role"] || req.body?.userRole;

  if (userRole === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
}

export function optionalAuth(req, res, next) {
  // Extract user info if available
  const userRole = req.headers["x-user-role"];
  req.userRole = userRole;
  next();
}
