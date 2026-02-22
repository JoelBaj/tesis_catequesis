import { IsArray, IsString } from 'class-validator';

export class SendEventNotificationDto {
  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsArray()
  personIds: number[];
}
