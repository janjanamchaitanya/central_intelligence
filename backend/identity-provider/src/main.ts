import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(),
    cors: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const isDevelopment = configService.get<boolean>('app.isDevelopment');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Security
  app.use(helmet());

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '*',
    credentials: configService.get<boolean>('CORS_CREDENTIALS') || true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-correlation-id'],
    exposedHeaders: ['x-request-id', 'x-correlation-id'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation (only in development)
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('Identity Provider API')
      .setDescription('Payment Intelligence - Identity Provider Service')
      .setVersion('1.0')
      .addTag('Authentication')
      .addTag('Users')
      .addTag('Sessions')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);

  console.log(`
    🚀 Application is running on: http://localhost:${port}/${apiPrefix}
    📚 Swagger Documentation: http://localhost:${port}/api/docs
    🌍 Environment: ${configService.get<string>('app.nodeEnv')}
  `);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
