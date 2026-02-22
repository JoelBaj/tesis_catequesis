import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  personId: number;

  @ApiProperty({ example: 'Magister en Educación' })
  @IsString()
  @IsOptional()
  magister?: string;

  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiProperty({ example: 'Observaciones sobre el profesor' })
  @IsString()
  @IsOptional()
  observation?: string;
}
