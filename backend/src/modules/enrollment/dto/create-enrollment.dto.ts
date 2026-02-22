import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  cursoId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  catequizandoId: number;

  @ApiProperty({ example: '2026-01-29' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ example: 'Observaciones sobre la matrícula' })
  @IsString()
  @IsOptional()
  observacion?: string;
}
