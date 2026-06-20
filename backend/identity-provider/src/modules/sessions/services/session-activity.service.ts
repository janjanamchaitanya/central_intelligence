import { Injectable, Logger } from '@nestjs/common';
import { SessionActivity } from '../../../database/models/session-activity.model';
import { ActivityType } from '../dto/session-activity.dto';

export interface ActivityData {
  session_id: string;
  activity_type: ActivityType;
  endpoint?: string;
  method?: string;
  status_code?: number;
  ip_address: string;
  user_agent?: string;
  location?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  metadata?: Record<string, any>;
}

@Injectable()
export class SessionActivityService {
  private readonly logger = new Logger(SessionActivityService.name);

  async recordActivity(data: ActivityData): Promise<SessionActivity> {
    const activity = await SessionActivity.query().insert({
      session_id: data.session_id,
      activity_type: data.activity_type,
      endpoint: data.endpoint,
      method: data.method,
      status_code: data.status_code,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      city: data.location?.city,
      country: data.location?.country,
      latitude: data.location?.latitude,
      longitude: data.location?.longitude,
      metadata: data.metadata,
    });

    this.logger.debug(`Activity recorded: ${activity.id} - ${data.activity_type} for session ${data.session_id}`);

    return activity;
  }

  async getSessionActivities(
    sessionId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ activities: SessionActivity[]; total: number }> {
    const query = SessionActivity.query()
      .where('session_id', sessionId)
      .orderBy('created_at', 'desc');

    const total = await query.resultSize();
    const activities = await query.limit(limit).offset(offset);

    return { activities, total };
  }

  async getUserActivities(
    userId: string,
    limit = 100,
    offset = 0,
  ): Promise<{ activities: SessionActivity[]; total: number }> {
    const query = SessionActivity.query()
      .joinRelated('session')
      .where('session.user_id', userId)
      .orderBy('session_activities.created_at', 'desc');

    const total = await query.resultSize();
    const activities = await query.limit(limit).offset(offset);

    return { activities, total };
  }

  async recordLogin(sessionId: string, ipAddress: string, userAgent?: string): Promise<SessionActivity> {
    return this.recordActivity({
      session_id: sessionId,
      activity_type: ActivityType.LOGIN,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  async recordLogout(sessionId: string, ipAddress: string, reason?: string): Promise<SessionActivity> {
    return this.recordActivity({
      session_id: sessionId,
      activity_type: ActivityType.LOGOUT,
      ip_address: ipAddress,
      metadata: { reason },
    });
  }

  async recordApiRequest(
    sessionId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    ipAddress: string,
  ): Promise<SessionActivity> {
    return this.recordActivity({
      session_id: sessionId,
      activity_type: ActivityType.API_REQUEST,
      endpoint,
      method,
      status_code: statusCode,
      ip_address: ipAddress,
    });
  }

  async recordSecurityEvent(
    sessionId: string,
    ipAddress: string,
    event: string,
    metadata?: Record<string, any>,
  ): Promise<SessionActivity> {
    return this.recordActivity({
      session_id: sessionId,
      activity_type: ActivityType.SECURITY_EVENT,
      ip_address: ipAddress,
      metadata: {
        ...metadata,
        event,
      },
    });
  }

  async cleanupOldActivities(daysToKeep = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const count = await SessionActivity.query()
      .where('created_at', '<', cutoffDate)
      .delete();

    this.logger.log(`Cleaned up ${count} old session activities (older than ${daysToKeep} days)`);

    return count;
  }
}
