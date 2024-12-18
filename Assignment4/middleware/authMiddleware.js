module.exports = async function (req, res, next) {
  console.log("Auth Middleware: User Session =>", req.session.user);
  if (!req.session.user?.role.includes("admin")) {
    return res.redirect("/login");
  }
  next();
};
