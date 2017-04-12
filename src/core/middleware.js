/*
 * login middleware that check whether the user
 * is logged in.
 */
function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  }
  res.status(401).end();
}

export { isAuthenticated };
