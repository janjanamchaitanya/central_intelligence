import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { getRequestContext } from "../middlewares/request-context.middleware";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format to include request context
const contextFormat = printf(
  ({ level, message, timestamp, stack, ...metadata }) => {
    const context = getRequestContext();
    const contextInfo = context
      ? `[${context.requestId}][${context.correlationId}]`
      : "[no-context]";

    const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : "";
    const stackTrace = stack ? `\n${stack}` : "";

    return `${timestamp} ${level} ${contextInfo}: ${message} ${meta}${stackTrace}`;
  },
);

// Console transport
const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    contextFormat,
  ),
});

// File transport for all logs
const fileTransport = new DailyRotateFile({
  dirname: process.env.LOG_DIR || "logs",
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: process.env.LOG_MAX_FILES || "14d",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    contextFormat,
  ),
});

// Error file transport
const errorFileTransport = new DailyRotateFile({
  dirname: process.env.LOG_DIR || "logs",
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: process.env.LOG_MAX_FILES || "14d",
  level: "error",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    contextFormat,
  ),
});

// Create logger instance
export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true })),
  transports: [consoleTransport, fileTransport, errorFileTransport],
  exceptionHandlers: [
    new DailyRotateFile({
      dirname: process.env.LOG_DIR || "logs",
      filename: "exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      dirname: process.env.LOG_DIR || "logs",
      filename: "rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// Create NestJS compatible logger service
export class WinstonLoggerService {
  log(message: string, context?: string) {
    winstonLogger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    winstonLogger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    winstonLogger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    winstonLogger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    winstonLogger.verbose(message, { context });
  }
}
