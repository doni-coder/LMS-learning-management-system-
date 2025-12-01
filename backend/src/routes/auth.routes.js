import { Router } from "express";
import passport from "passport";
import { checkUserRole } from "../middlewares/validateUserRole.middleware.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  checkUserRole
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Login failed." });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: "Login successful",
        user,
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({
      meaage: "Logout successful",
      user: req.user,
    });
  });
});

router.get("/current-user", (req, res) => {
  const user = req.user || req.session.tempUser;
  if (!user || !user.user_role) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  return res.status(200).json({ user });
});

export { router };
