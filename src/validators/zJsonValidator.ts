import {zValidator} from '@hono/zod-validator';
import {ZodError, type ZodType} from 'zod';
import validatorError from './errorValidator';

const zJsonValidator = <T extends ZodType>(schema: T) =>
  zValidator('json', schema, validatorError);

export default zJsonValidator;
