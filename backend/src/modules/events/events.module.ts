import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './services/events.service';
import { EventsController } from './controllers/events.controller';
import { EventAttendancesService } from './services/event-attendances.service';
import { EventAttendancesController } from './controllers/event-attendances.controller';
import { Event } from './entities/event.entity';
import { EventAttendance } from './entities/event-attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventAttendance])],
  controllers: [EventsController, EventAttendancesController],
  providers: [EventsService, EventAttendancesService],
  exports: [EventsService, EventAttendancesService],
})
export class EventsModule {}
