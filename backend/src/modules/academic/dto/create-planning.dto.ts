import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanningDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  nivelId: number;

  @ApiProperty({ example: 'Introducción a la fe' })
  @IsString()
  @IsNotEmpty()
  tema: string;

  @ApiProperty({ example: 'Comprender los fundamentos de la fe cristiana' })
  @IsString()
  @IsNotEmpty()
  objetivoGeneral: string;

  @ApiProperty({ example: 'Que el catequizando conozca los puntos clave del credo' })
  @IsString()
  @IsNotEmpty()
  objetivoEspecifico: string;

  @ApiProperty({ example: 'Exposición interactiva con preguntas y respuestas' })
  @IsString()
  @IsNotEmpty()
  metodologia: string;

  @ApiProperty({ example: '60 minutos' })
  @IsString()
  @IsNotEmpty()
  tiempo: string;

  @ApiProperty({ example: 'Biblia, proyector, materiales impresos' })
  @IsString()
  @IsNotEmpty()
  recursos: string;
}
