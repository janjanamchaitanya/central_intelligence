import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService): Redis => {
        const redisConfig = configService.get('redis');
        const client = new Redis(redisConfig);

        client.on('connect', () => {
          console.log('✅ Redis connection established');
        });

        client.on('error', (error) => {
          console.error('❌ Redis connection error:', error);
        });

        client.on('ready', () => {
          console.log('✅ Redis client ready');
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
