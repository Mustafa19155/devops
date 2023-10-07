async function checkAuth(req, res, next) {
  if (!req.user) {
    return res.sendStatus(401);
  }
  next();
}

module.exports = checkAuth;
