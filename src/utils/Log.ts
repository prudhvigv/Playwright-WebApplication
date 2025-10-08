import { Reporter } from './Logger';

export class Log {
  static info(message: string) {
    Reporter.logType.info(message);
  }
}
