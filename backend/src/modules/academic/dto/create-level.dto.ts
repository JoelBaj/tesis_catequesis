import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty({ example: 'Bautismo' })
  @IsString()
  @IsNotEmpty()
  materia: string;

  @ApiProperty({ example: 'S1' })
  @IsString()
  @IsNotEmpty()
  sacramento: string;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  prerequisitoId?: number;

  @ApiProperty({ example: 'A', description: 'A para Activo, I para Inactivo' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'I'])
  estado: string;
}
