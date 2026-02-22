import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncountersService } from './services/encounters.service';
import { EncountersController } from './controllers/encounters.controller';
import { AttendancesService } from './services/attendances.service';
import { AttendancesController } from './controllers/attendances.controller';
import { Encounter } from './entities/encounter.entity';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Encounter, Attendance])],
  controllers: [EncountersController, AttendancesController],
  providers: [EncountersService, AttendancesService],
  exports: [EncountersService, AttendancesService],
})
export class AttendanceModule {}
