export const checkUserRole = async (req, res, next) => {

  if (!req.user.user_role) {
    req.session.tempUser = req.user;

    return req.session.save(() => {
      console.log("➡️ Redirecting to role selection");
      res.redirect("http://localhost:5173/select-userRole");
    });
  }

  return req.session.save(() => {
    console.log("➡️ Redirecting to homepage");
    res.redirect("http://localhost:5173/");
  });
};
