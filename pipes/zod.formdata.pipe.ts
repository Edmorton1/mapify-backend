import type {HonoRequest} from 'hono';
import {ZodError, type ZodType, type z} from 'zod';

const zodValidateFormData = async <T extends ZodType>(
  req: HonoRequest,
  fileName: string,
  schema: T
): Promise<z.infer<T>> => {
  const parseBody = await req.parseBody();
  const body = parseBody.json;
  const file = parseBody[fileName];

  if (typeof body !== 'string') {
    throw new HttpError(400, 'The passed FormData has no property json');
  }

  try {
    const json = JSON.parse(body);
    const parsed = schema.parse({...json, [fileName]: file});
    return parsed;
  } catch (err) {
    if (err instanceof ZodError) {
      throw new HttpError(400, JSON.parse(err.message));
    }
    throw new HttpError(
      400,
      'The passed FormData with the property json is not JSON'
    );
  }
};

export default zodValidateFormData;
