type Mode = 'production' | 'development' | 'test';

interface Env {
  PORT: string;
  HOST: string;
  URL_SERVER: string;
  URL_CLIENT: string;
  AUTH_PORT: string;
  AUTH_HOST: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PORT: string;
  DB_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  SESSION_SECRET: string;
  COOKIE_NAME: string;
  NODE_ENV: Mode;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  KAFKA_BROKERS: string;
  KAFKA_CLIENT_ID: string;
  ELASTIC_URL: string;
}

type EnvKeys = keyof Env;

const validateEnv = (value: unknown, param: EnvKeys) => {
  isString(value, param);
  if (param === 'NODE_ENV') {
    isMode(value);
  }
};

function isString(value: unknown, param: EnvKeys): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Specify a required parameter ${param}`);
  }
}

export const NODE_ENV = {
  production: 'production',
  development: 'development'
};

const isMode = (value: string) => {
  if (value !== NODE_ENV.production && value !== NODE_ENV.development) {
    throw new Error(
      `NODE_ENV should be ${NODE_ENV.production} or ${NODE_ENV.development}. Now this - ${value}`
    );
  }
};

export const getEnv = (param: EnvKeys) => {
  const value = Bun.env[param];
  validateEnv(value, param);
  return value;
};
