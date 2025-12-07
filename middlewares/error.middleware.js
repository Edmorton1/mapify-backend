import {STATUS_CODES} from 'http';
import {HttpError} from '../http.error';
import Logger from '../src/connections';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const logger = Logger.logger;

  const message = err instanceof Error ? err.message : 'Unknown error';
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error({
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    message,
    stack
  });

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message ?? STATUS_CODES[err.statusCode]
    });
    return;
  }

  res.status(500).json({message, stack});
}

// export const asyncHandle =
//   (fn: RequestHandler): RequestHandler =>
//   (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
