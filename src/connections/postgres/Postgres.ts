import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import {PostgresConfig} from '../configs.js';
import Logger from '../logger/Logger.js';

class Postgres {
  private _pg: Kysely<any> | null = null;

  public connect() {
    const pool = new Pool(PostgresConfig);
    const dialect = new PostgresDialect({pool});

    pool.on('connect', () => Logger.logger.info('POSTGRES CONNECT'));
    pool.on('acquire', () => Logger.logger.info('POSTGRES ACQUIRE'));
    pool.on('error', (error) => Logger.logger.info({POSTGRES_ERROR: error}));
    pool.on('release', () => Logger.logger.info('POSTGRES RELEASE'));

    // TODO: Добавить типы
    this._pg = new Kysely<any>({dialect});
  }

  // TODO: Добавить типы
  public get pg(): Kysely<any> {
    if (!this._pg) throw new Error('Postgres is not connected');
    return this._pg;
  }

  public async disconnect() {
    if (this._pg) {
      await this._pg.destroy();
      this._pg = null;
    }
  }
}

export default new Postgres();
