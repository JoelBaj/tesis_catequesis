import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParameterTypeDto {
  @ApiProperty({ example: 'HM' })
  @IsString()
  @IsNotEmpty()
  tipos: string;

  @ApiProperty({ example: 'HM01' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: 'Descripción del tipo' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  gcp?: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  gsm?: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsOptional()
  cupo?: number;
}
