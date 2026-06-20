import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

// Config
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import kafkaConfig from './config/kafka.config';

// Modules
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './modules/redis/redis.module';
import { KafkaModule } from './events/kafka.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionsModule } from './modules/sessions/sessions.module';

// Middleware
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

// Interceptors
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Exception Filters
import { AllExceptionsFilter } from './common/exceptions/http-exception.filter';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, kafkaConfig],
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    // Database
    DatabaseModule,

    // Redis
    RedisModule,

    // Kafka
    KafkaModule,

    // Feature Modules
    AuthModule,
    SessionsModule,
  ],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
