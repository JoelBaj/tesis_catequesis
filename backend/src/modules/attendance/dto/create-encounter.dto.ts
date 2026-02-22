import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEncounterDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  cursoId: number;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  @IsNotEmpty()
  horario: string;

  @ApiProperty({ example: '2026-01-29' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  catequistaId: number;

  @ApiProperty({ example: 'Introducción a la fe' })
  @IsString()
  @IsNotEmpty()
  tema: string;

  @ApiProperty({ example: 'Dinámica de grupo, preguntas y respuestas' })
  @IsString()
  @IsOptional()
  actividades?: string;

  @ApiProperty({ example: 'Muy buen desempeño del grupo' })
  @IsString()
  @IsOptional()
  observacionCatequista?: string;
}
