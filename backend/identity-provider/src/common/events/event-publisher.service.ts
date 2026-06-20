import { Injectable, Logger, Inject } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { KAFKA_PRODUCER } from '../../events/kafka.module';
import { BaseAuthEvent, AuthEventType } from './auth.events';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);
  private readonly topic = 'payment-intelligence.auth.events';

  constructor(
    @Inject(KAFKA_PRODUCER) private readonly kafkaProducer: Producer,
  ) {}

  async publishAuthEvent(event: BaseAuthEvent): Promise<void> {
    try {
      await this.kafkaProducer.send({
        topic: this.topic,
        messages: [
          {
            key: event.user_id || event.session_id || 'anonymous',
            value: JSON.stringify({
              ...event,
              timestamp: event.timestamp.toISOString(),
            }),
            headers: {
              'event-type': event.event_type,
              'correlation-id': event.correlation_id,
            },
          },
        ],
      });

      this.logger.debug(`Published event: ${event.event_type} for user ${event.user_id || 'anonymous'}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.event_type}`, error);
      // Don't throw - event publishing failures shouldn't break the main flow
    }
  }

  async publishBatchEvents(events: BaseAuthEvent[]): Promise<void> {
    if (events.length === 0) return;

    try {
      const messages = events.map((event) => ({
        key: event.user_id || event.session_id || 'anonymous',
        value: JSON.stringify({
          ...event,
          timestamp: event.timestamp.toISOString(),
        }),
        headers: {
          'event-type': event.event_type,
          'correlation-id': event.correlation_id,
        },
      }));

      await this.kafkaProducer.send({
        topic: this.topic,
        messages,
      });

      this.logger.debug(`Published ${events.length} events in batch`);
    } catch (error) {
      this.logger.error(`Failed to publish batch events`, error);
    }
  }

  // Helper methods for specific events
  async publishLoginSuccess(data: {
    correlationId: string;
    userId: string;
    sessionId: string;
    deviceId: string;
    deviceType: string;
    authStrategy: string;
    ipAddress: string;
    userAgent?: string;
    location?: { city?: string; country?: string };
  }): Promise<void> {
    await this.publishAuthEvent({
      event_type: AuthEventType.LOGIN_SUCCESS,
      timestamp: new Date(),
      correlation_id: data.correlationId,
      user_id: data.userId,
      session_id: data.sessionId,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
      metadata: {
        device_id: data.deviceId,
        device_type: data.deviceType,
        auth_strategy: data.authStrategy,
        location: data.location,
      },
    });
  }

  async publishLoginFailed(data: {
    correlationId: string;
    email?: string;
    username?: string;
    reason: string;
    authStrategy: string;
    ipAddress: string;
  }): Promise<void> {
    await this.publishAuthEvent({
      event_type: AuthEventType.LOGIN_FAILED,
      timestamp: new Date(),
      correlation_id: data.correlationId,
      ip_address: data.ipAddress,
      metadata: {
        email: data.email,
        username: data.username,
        reason: data.reason,
        auth_strategy: data.authStrategy,
      },
    });
  }

  async publishLogout(data: {
    correlationId: string;
    userId: string;
    sessionId: string;
    reason?: string;
    ipAddress: string;
  }): Promise<void> {
    await this.publishAuthEvent({
      event_type: AuthEventType.LOGOUT,
      timestamp: new Date(),
      correlation_id: data.correlationId,
      user_id: data.userId,
      session_id: data.sessionId,
      ip_address: data.ipAddress,
      metadata: {
        reason: data.reason,
      },
    });
  }

  async publishDeviceBound(data: {
    correlationId: string;
    userId: string;
    deviceId: string;
    deviceType: string;
    isNewDevice: boolean;
    isTrusted: boolean;
    riskScore: number;
    ipAddress: string;
  }): Promise<void> {
    await this.publishAuthEvent({
      event_type: AuthEventType.DEVICE_BOUND,
      timestamp: new Date(),
      correlation_id: data.correlationId,
      user_id: data.userId,
      ip_address: data.ipAddress,
      metadata: {
        device_id: data.deviceId,
        device_type: data.deviceType,
        is_new_device: data.isNewDevice,
        is_trusted: data.isTrusted,
        risk_score: data.riskScore,
      },
    });
  }

  async publishSuspiciousActivity(data: {
    correlationId: string;
    userId?: string;
    sessionId?: string;
    activityType: string;
    riskScore: number;
    details: Record<string, any>;
    ipAddress: string;
  }): Promise<void> {
    await this.publishAuthEvent({
      event_type: AuthEventType.SUSPICIOUS_ACTIVITY,
      timestamp: new Date(),
      correlation_id: data.correlationId,
      user_id: data.userId,
      session_id: data.sessionId,
      ip_address: data.ipAddress,
      metadata: {
        activity_type: data.activityType,
        risk_score: data.riskScore,
        details: data.details,
      },
    });
  }
}
