const {zodValidateFormData} = require('../../pipes');
const {UserDtoZodSchema} = require('../../../shared/models/schemas/user');
const {ProfileDtoZodSchema} = require('../../../shared/models/schemas/profile');
const {registrationService} = require('./registration.service');
const {zExpressMulterFile} = require('../../../shared/models/enums/zod');
const z = require('zod');
const {logger} = require('../../connections');

const RegistrationDtoSchema = z.object({
  user: UserDtoZodSchema,
  profile: ProfileDtoZodSchema,
  avatar: zExpressMulterFile.optional()
});

module.exports = {
  /**
   * @param {import('express').Request} req
   * @param {import ('express').Response} res
   * */
  async registrationController(req, res) {
    const authDto = zodValidateFormData(req, 'avatar', RegistrationDtoSchema);

    logger.debug({REQUEST_REGISTRATION: {...authDto, avatar: {...authDto.avatar, buffer: undefined}}});

    const provider = req.session.provider;
    delete req.session.provider;

    const {user: userDto, profile: profileDto, avatar} = authDto;

    const profile = await registrationService({userDto, profileDto, avatar, provider});

    logger.debug({RESPONSE_REGISTRATION: profile});

    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      req.session.payload = {id: profile.id, role: 'user'};
      res.status(201).json(profile);
    });
  }
};
