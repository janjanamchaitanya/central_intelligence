import { registerAs } from '@nestjs/config';
import { KafkaConfig } from 'kafkajs';

export default registerAs(
  'kafka',
  (): KafkaConfig & { groupId: string; retryAttempts: number; retryDelay: number } => ({
    clientId: process.env.KAFKA_CLIENT_ID || 'identity-provider',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    groupId: process.env.KAFKA_GROUP_ID || 'identity-provider-group',
    retryAttempts: parseInt(process.env.KAFKA_RETRY_ATTEMPTS, 10) || 5,
    retryDelay: parseInt(process.env.KAFKA_RETRY_DELAY, 10) || 3000,
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
      initialRetryTime: 100,
      retries: 8,
      maxRetryTime: 30000,
      multiplier: 2,
      factor: 0.2,
    },
  }),
);
