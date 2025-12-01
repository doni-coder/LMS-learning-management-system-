export const isLoggedIn = (req, res, next) => {
  console.log(req.isAuthenticated());
  console.log(req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
