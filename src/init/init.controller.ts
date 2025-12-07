import type {Context} from 'hono';
import {logger} from '../../connections';
import {getProfileById} from '../_shared/shared.repository';

export const initController = async (c: Context) => {
  if (!req.session.payload) {
    logger.debug('REQUEST_INIT');
    logger.debug('RESPONSE_INIT');

    res.sendStatus(204);
    return;
  }

  const id = req.session.payload.id;

  logger.debug({REQUEST_INIT: {id}});

  const profile = await getProfileById(id);

  logger.debug({RESPONSE_INIT: {profile}});

  res.json(profile);
};

export default initController;
