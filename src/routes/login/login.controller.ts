import {Logger} from '@connections';
import {LoginDtoZodSchema} from '../../../shared/models/schemas/auth';
import {zodValidateSchema} from '../../pipes';

import router from '../router';
import {loginService} from './login.service';

router.post();

export async function loginController(req, res) {
  const userDto = zodValidateSchema(LoginDtoZodSchema, req.body);

  Logger.logger.debug({REQUEST_LOGIN: {userDto}});
  const {email, password} = userDto;

  const {payload, profile} = await loginService({email, password});

  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    req.session.payload = payload;

    Logger.logger.debug({RESPONSE_LOGIN: {profile}});

    res.json(profile);
  });
}
