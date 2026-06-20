import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../services/session.service';
import { SessionActivityService } from '../services/session-activity.service';
import { EndSessionDto } from '../dto/end-session.dto';
import { SessionResponseDto, SessionListResponseDto } from '../dto/session-response.dto';
import { SessionActivityListDto } from '../dto/session-activity.dto';
import { EventPublisherService } from '../../../common/events/event-publisher.service';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionActivityService: SessionActivityService,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  @Get()
  async listUserSessions(
    @Req() request: Request,
    @Query('include_inactive') includeInactive?: string,
  ): Promise<SessionListResponseDto> {
    const userId = (request as any).user?.id;
    const currentSessionId = (request as any).sessionId;

    const sessions = await this.sessionService.findUserSessions(
      userId,
      includeInactive === 'true',
    );

    const sessionDtos: SessionResponseDto[] = sessions.map((session) => ({
      id: session.id,
      user_id: session.user_id,
      device_type: session.device_type as any,
      device_name: session.device?.device_name,
      browser: session.browser,
      browser_version: session.browser_version,
      os_version: session.os_version,
      ip_address: session.ip_address,
      location: {
        city: session.city,
        country: session.country,
      },
      is_active: session.is_active,
      is_current: session.id === currentSessionId,
      created_at: session.created_at,
      last_active_at: session.last_active_at || session.created_at,
      expires_at: session.expires_at,
    }));

    const activeCount = sessionDtos.filter((s) => s.is_active).length;

    return {
      sessions: sessionDtos,
      total: sessionDtos.length,
      active_count: activeCount,
    };
  }

  @Get(':sessionId')
  async getSession(
    @Param('sessionId') sessionId: string,
    @Req() request: Request,
  ): Promise<SessionResponseDto> {
    const userId = (request as any).user?.id;
    const currentSessionId = (request as any).sessionId;

    const session = await this.sessionService.findSession(sessionId);

    if (!session || session.user_id !== userId) {
      throw new Error('Session not found');
    }

    return {
      id: session.id,
      user_id: session.user_id,
      device_type: session.device_type as any,
      device_name: session.device?.device_name,
      browser: session.browser,
      browser_version: session.browser_version,
      os_version: session.os_version,
      ip_address: session.ip_address,
      location: {
        city: session.city,
        country: session.country,
      },
      is_active: session.is_active,
      is_current: session.id === currentSessionId,
      created_at: session.created_at,
      last_active_at: session.last_active_at || session.created_at,
      expires_at: session.expires_at,
    };
  }

  @Get(':sessionId/activity')
  async getSessionActivity(
    @Param('sessionId') sessionId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Req() request: Request,
  ): Promise<SessionActivityListDto> {
    const userId = (request as any).user?.id;

    // Verify session belongs to user
    const session = await this.sessionService.findSession(sessionId);
    if (!session || session.user_id !== userId) {
      throw new Error('Session not found');
    }

    const { activities, total } = await this.sessionActivityService.getSessionActivities(
      sessionId,
      limit,
      offset,
    );

    return {
      activities: activities.map((activity) => ({
        id: activity.id,
        session_id: activity.session_id,
        activity_type: activity.activity_type as any,
        endpoint: activity.endpoint,
        method: activity.method,
        status_code: activity.status_code,
        ip_address: activity.ip_address,
        user_agent: activity.user_agent,
        location: {
          city: activity.city,
          country: activity.country,
        },
        metadata: activity.metadata,
        created_at: activity.created_at,
      })),
      total,
      session_id: sessionId,
    };
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async endSession(
    @Param('sessionId') sessionId: string,
    @Body() endSessionDto: EndSessionDto,
    @Req() request: Request,
  ): Promise<void> {
    const userId = (request as any).user?.id;
    const correlationId = (request as any).correlationId || 'no-correlation-id';

    await this.sessionService.endSession(sessionId, userId, endSessionDto.reason);

    await this.sessionActivityService.recordLogout(sessionId, '0.0.0.0', endSessionDto.reason);

    await this.eventPublisher.publishLogout({
      correlationId,
      userId,
      sessionId,
      reason: endSessionDto.reason,
      ipAddress: '0.0.0.0',
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async endAllSessions(
    @Query('except_current') exceptCurrent: string,
    @Body('reason') reason: string,
    @Req() request: Request,
  ): Promise<void> {
    const userId = (request as any).user?.id;
    const currentSessionId = (request as any).sessionId;
    const correlationId = (request as any).correlationId || 'no-correlation-id';

    const exceptSessionId = exceptCurrent === 'true' ? currentSessionId : undefined;

    const count = await this.sessionService.endAllUserSessions(userId, exceptSessionId, reason);

    await this.eventPublisher.publishAuthEvent({
      event_type: 'auth.session.ended' as any,
      timestamp: new Date(),
      correlation_id: correlationId,
      user_id: userId,
      ip_address: '0.0.0.0',
      metadata: { count, reason: reason || 'logout_all' },
    });
  }
}
