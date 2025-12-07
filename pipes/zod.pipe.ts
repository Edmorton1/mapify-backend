import type {ZodType, z} from 'zod';


const zodValidateSchema = <T extends ZodType>(
  schema: T,
  value: unknown
): z.infer<T> => {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error);
  }
  return parsed.data;
};

export default zodValidateSchema;
