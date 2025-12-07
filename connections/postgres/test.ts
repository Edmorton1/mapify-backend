import Logger from '../logger/Logger';
import Postgres from './Postgres';

Logger.connect();
Postgres.connect();

const pg = Postgres.pg;

console.log(await pg.selectFrom('users').selectAll().execute());
