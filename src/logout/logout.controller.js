const {getEnv} = require('../../getEnv');
const {logger} = require('../../connections');

module.exports = {
  /**
   * @param {import('express').Request} req
   * @param {import ('express').Response} res
   * */
  logoutController(req, res) {
    logger.debug('REQUEST_LOGOUT');

    req.session.destroy((err) => {
      if (err) console.error(err);

      logger.debug('RESPONSE_LOGOUT');

      res.clearCookie(getEnv('COOKIE_NAME')).sendStatus(204);
    });
  }
};
