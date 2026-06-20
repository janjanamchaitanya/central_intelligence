import { Module } from '@nestjs/common';
import { SessionsController } from './controllers/sessions.controller';
import { SessionService } from './services/session.service';
import { SessionActivityService } from './services/session-activity.service';
import { EventPublisherService } from '../../common/events/event-publisher.service';

@Module({
  controllers: [SessionsController],
  providers: [
    SessionService,
    SessionActivityService,
    EventPublisherService,
  ],
  exports: [SessionService, SessionActivityService],
})
export class SessionsModule {}
