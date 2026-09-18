export const adminAuth = (req, res, next) => {
  const configuredToken = process.env.ADMIN_TOKEN;
  const requestToken = req.get("x-admin-token");

  if (!configuredToken || requestToken !== configuredToken) {
    return res.status(401).json({
      success: false,
      message: "Admin token is missing or invalid.",
    });
  }

  return next();
};
