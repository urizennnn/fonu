import { Scope, Injectable, Inject } from '@nestjs/common';
import { sprintf } from 'sprintf-js';
import { INQUIRER } from '@nestjs/core';
import * as winston from 'winston';

export type Constructor<T> = new (...args: any[]) => T;
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const Colors: Record<LogLevel, string> = {
  debug: '\x1b[34m',
  warn: '\x1b[33m',
  info: '\x1b[32m',
  error: '\x1b[31m',
};

const logger = winston.createLogger({
  level: LogLevel.DEBUG,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.ms(),
        winston.format.colorize({ message: true }),
        winston.format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
        winston.format.printf(
          ({ timestamp, level, message, context, trace, ms }) => {
            const c = (msg: string | number) =>
              `${Colors[level]}${msg}\x1b[39m`;

            return (
              `\x1b[35m[FONU]\x1b[39m ${c(process.pid + '  -')} ${timestamp}     ` +
              `${c(level.toUpperCase())} \x1b[33m[${context}] ${message} \x1b[33m${ms}\x1b[39m` +
              //@ts-ignore
              `${trace && trace.stack ? `\n${trace?.stack}` : ''}`
            );
          },
        ),
      ),
    }),
  ],
});
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private readonly logger: winston.Logger;
  private context!: string;

  constructor(@Inject(INQUIRER) source: object | null) {
    logger.level = 'info';

    this.logger = logger;
    this.setContext(
      typeof source === 'string' ? source : (source?.constructor ?? AppLogger),
    );
  }

  setContext(context: string | Constructor<any> | Function) {
    this.context = typeof context === 'string' ? context : context.name;
  }

  error(message: any, ...args: [...vars: any[], trace: Partial<Error>]) {
    this.logger.error({
      message: sprintf(message, ...args.slice(0, -1)),
      context: this.context,
      trace: args.at(-1),
    });
  }

  warn(message: any, ...args: any[]) {
    this.logger.warn({
      message: sprintf(message, ...args),
      context: this.context,
    });
  }

  info(message: any, ...args: any[]) {
    this.logger.info({
      message: sprintf(message, ...args),
      context: this.context,
    });
  }

  debug(message: any, ...args: any[]) {
    this.logger.debug({
      message: sprintf(message, ...args),
      context: this.context,
    });
  }
}
