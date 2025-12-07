import {zValidator} from '@hono/zod-validator';
import {HTTPException} from 'hono/http-exception';
import z, {
  ZodError,
  ZodFile,
  ZodObject,
  type ZodRawShape,
  type ZodType
} from 'zod';
import validatorError from './errorValidator';

const transformSchema = <T extends ZodType>(schema: T): T => {
  if (!(schema instanceof ZodObject)) {
    throw new Error('Schema for formData is not object');
  }

  const shape = {...schema.shape};

  const fileFields: ZodRawShape = {};
  const jsonFields: ZodRawShape = {};

  for (const key in shape) {
    const field = shape[key];

    if (field instanceof ZodFile) {
      fileFields[key] = field;
    } else {
      jsonFields[key] = field;
    }
  }

  const inputSchema = z.object({
    json: z.string(),
    ...fileFields
  });

  return inputSchema.transform((data) => {
    try {
      const parsed = JSON.parse(data.json);
      const newSchema = {
        ...parsed,
        ...Object.fromEntries(
          Object.entries(data).filter(([k]) => k !== 'json')
        )
      };
      return schema.parse(newSchema);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HTTPException(400, {message: err.message});
      }
      throw new HTTPException(400, {message: 'json is not JSON'});
    }
  });
};

const zFormValidator = <T extends ZodType>(schema: T) =>
  zValidator('form', transformSchema(schema), validatorError);

export default zFormValidator;
