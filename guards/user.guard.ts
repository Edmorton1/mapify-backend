module.exports = {
  userGuard(req, res, next) {
    const payload = req.session.payload;

    if (!payload) {
      res.sendStatus(401);
      return;
    }

    next();
  }
};
