import {getEnv, NODE_ENV} from '@utils/getEnv';
import type {PoolConfig} from 'pg';
import type {LoggerOptions} from 'pino';

export const PostgresConfig: PoolConfig = {
  database: getEnv('DB_NAME'),
  host: getEnv('DB_HOST'),
  user: getEnv('DB_USER'),
  port: parseInt(getEnv('DB_PORT')),
  password: getEnv('DB_PASSWORD')
};

export const LoggerConfig: LoggerOptions = {
  level: 'debug',
  transport:
    getEnv('NODE_ENV') === NODE_ENV.development
      ? {
          target: 'pino-pretty',
          options: {colorize: true}
        }
      : undefined
};
