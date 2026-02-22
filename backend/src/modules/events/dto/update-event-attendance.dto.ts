import { PartialType } from '@nestjs/swagger';
import { CreateEventAttendanceDto } from './create-event-attendance.dto';

export class UpdateEventAttendanceDto extends PartialType(CreateEventAttendanceDto) {}
