import { IsArray, IsString, IsNumber } from 'class-validator';

export class SendEncounterNotificationDto {
  @IsNumber()
  courseId: number;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsArray()
  studentIds: number[];
}
