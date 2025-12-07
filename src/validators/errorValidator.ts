import type {Hook} from '@hono/zod-validator';
import type {Env} from 'hono';
import {ZodError} from 'zod';

type HookValidator = Hook<any, Env, string, any, {}, any>;

const validatorError: HookValidator = (result, c) => {
  if (!result.success) {
    const {error} = result;
    if (error instanceof ZodError) {
      return c.text(error.message, 400);
    }
    return c.text('Invalid!', 400);
  }
};

export default validatorError;
