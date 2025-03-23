import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from './logger';

@Injectable()
export class FonuMiddlewareLogger implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const logMessage = `${method} ${originalUrl} - ${statusCode} - ${duration}ms`;

      if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.info(logMessage);
      }
    });

    next();
  }
}
