import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SendAbsencesNotificationDto {
  @ApiProperty({ example: 12 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ example: '2025' })
  @IsString()
  @IsNotEmpty()
  periodo: string;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  studentIds: number[];

  @ApiProperty({ example: 'Notificacion de inasistencias' })
  @IsString()
  @IsOptional()
  asunto?: string;

  @ApiProperty({ example: 'Su hijo ha tenido 3 o mas inasistencias' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;
}
