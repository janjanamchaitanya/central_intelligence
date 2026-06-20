import { Injectable, Inject } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { KAFKA_PRODUCER } from '../kafka.module';
import { getRequestContext } from '../../common/middlewares/request-context.middleware';

export enum EventTopics {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  SESSION_CREATED = 'session.created',
  SESSION_EXPIRED = 'session.expired',
  AUTH_FAILED = 'auth.failed',
  PASSWORD_RESET = 'password.reset',
  TWO_FACTOR_ENABLED = 'two_factor.enabled',
  TWO_FACTOR_DISABLED = 'two_factor.disabled',
}

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  requestId?: string;
  correlationId?: string;
  userId?: number;
  data: any;
}

@Injectable()
export class EventProducer {
  constructor(@Inject(KAFKA_PRODUCER) private readonly producer: Producer) {}

  async publishEvent(topic: EventTopics, data: any, userId?: number): Promise<void> {
    const context = getRequestContext();

    const event: BaseEvent = {
      eventId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      eventType: topic,
      timestamp: new Date(),
      requestId: context?.requestId,
      correlationId: context?.correlationId,
      userId,
      data,
    };

    await this.producer.send({
      topic,
      messages: [
        {
          key: userId?.toString() || event.eventId,
          value: JSON.stringify(event),
          headers: {
            'event-type': topic,
            'request-id': context?.requestId || '',
            'correlation-id': context?.correlationId || '',
          },
        },
      ],
    });

    console.log(`📤 Event published: ${topic}`, { eventId: event.eventId });
  }

  async publishUserCreatedEvent(userId: number, userData: any): Promise<void> {
    await this.publishEvent(EventTopics.USER_CREATED, userData, userId);
  }

  async publishUserLoginEvent(userId: number, loginData: any): Promise<void> {
    await this.publishEvent(EventTopics.USER_LOGIN, loginData, userId);
  }

  async publishUserLogoutEvent(userId: number): Promise<void> {
    await this.publishEvent(EventTopics.USER_LOGOUT, {}, userId);
  }

  async publishSessionCreatedEvent(userId: number, sessionData: any): Promise<void> {
    await this.publishEvent(EventTopics.SESSION_CREATED, sessionData, userId);
  }

  async publishAuthFailedEvent(username: string, reason: string): Promise<void> {
    await this.publishEvent(EventTopics.AUTH_FAILED, { username, reason });
  }
}
