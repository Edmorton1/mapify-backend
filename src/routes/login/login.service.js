const bcrypt = require('bcrypt');
const {HttpError} = require('../../http.error');
const {getProfileById} = require('../_shared/shared.repository');
const {getPassword} = require('./login.repository');

module.exports = {
  async loginService({email, password}) {
    const {password: hashedPassword, ...payload} = await getPassword(email);
    const isPasswordCorrect = await bcrypt.compare(hashedPassword, password);

    if (!isPasswordCorrect) {
      throw new HttpError(401, 'Password is incorrect');
    }

    const profile = await getProfileById(payload.id);
    return {payload, profile};
  }
};
