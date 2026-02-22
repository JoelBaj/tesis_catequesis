import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  feligresId: number;

  @ApiProperty({ example: 'A', description: 'A para Activo, I para Inactivo' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'I'])
  estado: string;

  @ApiProperty({ example: 'Nota' })
  @IsString()
  @IsOptional()
  observacion?: string;

  @ApiProperty({ example: 'N' })
  @IsString()
  @IsNotEmpty()
  necesidadEspecial: string;

  @ApiProperty({ example: 'student@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  madreId?: number;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  padreId?: number;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  representanteId?: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @IsNotEmpty()
  edad: number;

  @ApiProperty({ example: 'S' })
  @IsString()
  @IsOptional()
  padresCasados?: string;

  @ApiProperty({ example: 'N' })
  @IsString()
  @IsOptional()
  padresBodaCivil?: string;

  @ApiProperty({ example: 2020 })
  @IsInt()
  @IsOptional()
  bautizo?: number;
}
