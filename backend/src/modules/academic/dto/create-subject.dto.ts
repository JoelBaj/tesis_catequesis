import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  @IsNotEmpty()
  materia: string;

  @ApiProperty({ example: 'Bautismo' })
  @IsString()
  @IsNotEmpty()
  sacramento: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  prerequisitoId?: number;

  @ApiProperty({ example: 'AC' })
  @IsString()
  @IsNotEmpty()
  estado: string;
}
