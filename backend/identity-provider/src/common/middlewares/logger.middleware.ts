import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getRequestContext } from './request-context.middleware';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;
      const context = getRequestContext();

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${duration}ms`;

      const logData = {
        requestId: context?.requestId,
        correlationId: context?.correlationId,
        method,
        url: originalUrl,
        statusCode,
        contentLength: contentLength || 0,
        duration,
        ip,
        userAgent,
      };

      if (statusCode >= 500) {
        this.logger.error(logMessage, JSON.stringify(logData));
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, JSON.stringify(logData));
      } else {
        this.logger.log(logMessage, JSON.stringify(logData));
      }
    });

    next();
  }
}
