import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SendCourseNotificationDto {
  @ApiProperty({ example: 12 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ example: '2025' })
  @IsString()
  @IsOptional()
  periodo?: string;

  @ApiProperty({ example: 'P1' })
  @IsString()
  @IsOptional()
  parcial?: string;

  @ApiProperty({ example: 'Encuentro' })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: 'Notificacion del curso' })
  @IsString()
  @IsOptional()
  asunto?: string;

  @ApiProperty({ example: 'Mensaje para los padres' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;
}
