import { Module, Global, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, Admin } from 'kafkajs';

export const KAFKA_PRODUCER = 'KAFKA_PRODUCER';
export const KAFKA_CONSUMER = 'KAFKA_CONSUMER';
export const KAFKA_ADMIN = 'KAFKA_ADMIN';

@Global()
@Module({
  providers: [
    {
      provide: 'KAFKA_CLIENT',
      useFactory: (configService: ConfigService): Kafka => {
        const kafkaConfig = configService.get('kafka');
        return new Kafka({
          clientId: kafkaConfig.clientId,
          brokers: kafkaConfig.brokers,
          retry: kafkaConfig.retry,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: KAFKA_PRODUCER,
      useFactory: async (kafka: Kafka): Promise<Producer> => {
        const producer = kafka.producer({
          allowAutoTopicCreation: true,
          transactionTimeout: 30000,
        });
        await producer.connect();
        console.log('✅ Kafka Producer connected');
        return producer;
      },
      inject: ['KAFKA_CLIENT'],
    },
    {
      provide: KAFKA_CONSUMER,
      useFactory: async (
        kafka: Kafka,
        configService: ConfigService,
      ): Promise<Consumer> => {
        const kafkaConfig = configService.get('kafka');
        const consumer = kafka.consumer({
          groupId: kafkaConfig.groupId,
          sessionTimeout: 30000,
          heartbeatInterval: 3000,
        });
        await consumer.connect();
        console.log('✅ Kafka Consumer connected');
        return consumer;
      },
      inject: ['KAFKA_CLIENT', ConfigService],
    },
    {
      provide: KAFKA_ADMIN,
      useFactory: async (kafka: Kafka): Promise<Admin> => {
        const admin = kafka.admin();
        await admin.connect();
        console.log('✅ Kafka Admin connected');
        return admin;
      },
      inject: ['KAFKA_CLIENT'],
    },
  ],
  exports: [KAFKA_PRODUCER, KAFKA_CONSUMER, KAFKA_ADMIN],
})
export class KafkaModule implements OnModuleDestroy {
  constructor(
    @Inject(KAFKA_PRODUCER) private readonly producer: Producer,
    @Inject(KAFKA_CONSUMER) private readonly consumer: Consumer,
    @Inject(KAFKA_ADMIN) private readonly admin: Admin,
  ) {}

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.admin.disconnect();
    console.log('🔌 Kafka connections closed');
  }
}
