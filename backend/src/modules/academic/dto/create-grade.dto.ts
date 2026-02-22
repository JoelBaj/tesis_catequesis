import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({ example: '2024' })
  @IsString()
  @IsNotEmpty()
  periodo: string;

  @ApiProperty({ example: 'P1' })
  @IsString()
  @IsNotEmpty()
  parcial: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  cursoId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  catequizandoId: number;

  @ApiProperty({ example: 9.5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  tareas?: number;

  @ApiProperty({ example: 8.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  lecciones?: number;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  evaluacionOral?: number;

  @ApiProperty({ example: 9.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  evaluacionEscrita?: number;

  @ApiProperty({ example: 'Muy Bueno' })
  @IsString()
  @IsNotEmpty()
  cualitativa: string;

  @ApiProperty({ example: 8.75 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  cuantitativa?: number;

  @ApiProperty({ example: 'Excelente desempeño' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
