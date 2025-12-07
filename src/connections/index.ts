import Logger from './logger/Logger';
import Postgres from './postgres/postgres';

const connect = () => {
  Logger.connect();
  Postgres.connect();
};

export {Logger, Postgres, connect};
