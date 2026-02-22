import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatechistDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  feligresId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  nivelId: number;

  @ApiProperty({ example: 'Licenciatura en Pedagogía' })
  @IsString()
  @IsOptional()
  titulo1?: string;

  @ApiProperty({ example: 'Diplomado en Catequesis' })
  @IsString()
  @IsOptional()
  titulo2?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  aniosApostolado: number;

  @ApiProperty({ example: 'ACTIVE' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 'Principal' })
  @IsString()
  @IsNotEmpty()
  tipo: string;
}
