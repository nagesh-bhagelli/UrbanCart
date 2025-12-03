export function requireAuth(req, res, next) {
    const userId = req.headers["x-user-id"];

    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    // In a real app, verify token. Here we trust the header for simplicity as per current project state.
    req.user = { _id: userId };
    next();
}
