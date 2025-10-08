import { createLogger, format, transports } from 'winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const myCustomLevels = {
  colors: {
    debug: 'inverse blue',
    info: 'italic green',
    warn: 'italic yellow',
    error: 'bold red',
  },
};
winston.addColors(myCustomLevels.colors);

export class Reporter {
  static logType = createLogger({
    level: 'info',
    format: format.combine(
      format.simple(),
      format.timestamp(),
      format.colorize(),
      format.align(),
      format.printf((info) => `[${info.level}]: ${info.message}`),
    ),
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        filename: 'winston_Logs/Log-%DATE%.log',
        frequency: '10m',
        datePattern: 'YYYY-HH-MM-HH',
        json: false,
        zippedArchive: true,
        maxFiles: '3',
      }),
    ],
  });
}
