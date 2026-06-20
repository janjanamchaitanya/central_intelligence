import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redisClient.setex(key, ttl, JSON.stringify(data));
  }

  async getSession(sessionId: string): Promise<any | null> {
    const key = `session:${sessionId}`;
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redisClient.del(key);
  }

  async refreshSessionTTL(sessionId: string, ttl: number = 3600): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redisClient.expire(key, ttl);
  }

  // Generic cache methods
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.setex(key, ttl, serialized);
    } else {
      await this.redisClient.set(key, serialized);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }

  // Rate limiting
  async incrementCounter(key: string, ttl: number = 60): Promise<number> {
    const current = await this.redisClient.incr(key);
    if (current === 1) {
      await this.redisClient.expire(key, ttl);
    }
    return current;
  }

  // Distributed locking
  async acquireLock(
    lockKey: string,
    ttl: number = 10,
    retries: number = 3,
  ): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      const result = await this.redisClient.set(lockKey, '1', 'EX', ttl, 'NX');
      if (result === 'OK') {
        return true;
      }
      await this.sleep(100 * (i + 1));
    }
    return false;
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.redisClient.del(lockKey);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Pub/Sub
  async publish(channel: string, message: any): Promise<void> {
    await this.redisClient.publish(channel, JSON.stringify(message));
  }

  subscribe(channel: string, callback: (message: any) => void): void {
    const subscriber = this.redisClient.duplicate();
    subscriber.subscribe(channel);
    subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        callback(JSON.parse(msg));
      }
    });
  }
}
