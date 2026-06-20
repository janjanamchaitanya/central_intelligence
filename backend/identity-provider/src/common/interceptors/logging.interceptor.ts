import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getRequestContext } from '../middlewares/request-context.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const ctx = getRequestContext();
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} - Success in ${duration}ms`,
            JSON.stringify({
              requestId: ctx?.requestId,
              correlationId: ctx?.correlationId,
              duration,
              method,
              url,
            }),
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${url} - Error in ${duration}ms: ${error.message}`,
            error.stack,
            JSON.stringify({
              requestId: ctx?.requestId,
              correlationId: ctx?.correlationId,
              duration,
              method,
              url,
              error: error.message,
            }),
          );
        },
      }),
    );
  }
}
