const {zodValidateSchema} = require('../../pipes');
const {loginService} = require('./login.service');
const {LoginDtoZodSchema} = require('../../../shared/models/schemas/auth');
const {logger} = require('../../connections');

module.exports = {
  /**
   * @param {import('express').Request} req
   * @param {import ('express').Response} res
   * */
  async loginController(req, res) {
    const userDto = zodValidateSchema(LoginDtoZodSchema, req.body);

    logger.debug({REQUEST_LOGIN: {userDto}});
    const {email, password} = userDto;

    const {payload, profile} = await loginService({email, password});

    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      req.session.payload = payload;

      logger.debug({RESPONSE_LOGIN: {profile}});

      res.json(profile);
    });
  }
};
