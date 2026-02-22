import { IsArray, IsString, IsNumber } from 'class-validator';

export class SendGradesNotificationDto {
  @IsNumber()
  courseId: number;

  @IsString()
  periodo: string;

  @IsString()
  parcial: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsArray()
  studentIds: number[];
}
