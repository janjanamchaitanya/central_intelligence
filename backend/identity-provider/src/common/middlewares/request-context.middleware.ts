import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';
import {
  REQUEST_ID_HEADER,
  CORRELATION_ID_HEADER,
} from '../constants/context.constants';

export interface RequestContext {
  requestId: string;
  correlationId: string;
  timestamp: Date;
  path: string;
  method: string;
  userId?: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract or generate requestId
    const requestId =
      (req.headers[REQUEST_ID_HEADER] as string) || uuidv4();

    // Extract or generate correlationId
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) || uuidv4();

    // Create request context
    const context: RequestContext = {
      requestId,
      correlationId,
      timestamp: new Date(),
      path: req.path,
      method: req.method,
      userId: (req as any).user?.id,
    };

    // Set headers in response
    res.setHeader(REQUEST_ID_HEADER, requestId);
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // Store context in async local storage
    asyncLocalStorage.run(context, () => {
      next();
    });
  }
}

// Helper function to get current context
export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}
