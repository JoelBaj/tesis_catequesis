import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  nivelId: number;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsOptional()
  grupo?: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsOptional()
  paralelo?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  catequistaId: number;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  catequistaAuxiliarId?: number;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  catequistaSupleteId?: number;

  @ApiProperty({ example: 'A', description: 'A para Activo, I para Inactivo' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'I'])
  estado: string;

  @ApiProperty({ example: 'Aula 1' })
  @IsString()
  @IsNotEmpty()
  aula: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsNotEmpty()
  cupo: number;

  @ApiProperty({ example: 'Catequesis' })
  @IsString()
  @IsOptional()
  tipoCurso?: string;

  @ApiProperty({ example: '2024' })
  @IsString()
  @IsNotEmpty()
  periodo: string;
}
