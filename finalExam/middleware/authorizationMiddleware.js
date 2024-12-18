
module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");  // Redirect if the user is not authenticated
  }
    next();
  };
  