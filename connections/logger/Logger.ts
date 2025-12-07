import pino, {type Logger as PinoLogger} from 'pino';
import {LoggerConfig} from '../configs.js';

class Logger {
  private _logger: PinoLogger | null = null;

  public connect = () => {
    this._logger = pino(LoggerConfig);
    this._logger.info('PINO CONNECT');
  };

  public get logger(): PinoLogger {
    if (!this._logger) {
      throw new Error('Logger is not connected');
    }
    return this._logger;
  }

  public disconnect() {
    if (this._logger) {
      this._logger.flush();
      this._logger = null;
    }
  }
}

export default new Logger();
