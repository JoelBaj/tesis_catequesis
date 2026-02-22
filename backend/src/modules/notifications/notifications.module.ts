import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '@modules/enrollment/entities/enrollment.entity';
import { Student } from '@modules/persons/entities/student.entity';
import { Attendance } from '@modules/attendance/entities/attendance.entity';
import { Grade } from '@modules/academic/entities/grade.entity';
import { Person } from '@modules/persons/entities/person.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Attendance, Grade, Person])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
