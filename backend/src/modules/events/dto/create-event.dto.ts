import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'MD' })
  @IsString()
  @IsNotEmpty()
  tipoevento: string;

  @ApiProperty({ example: 'Navidad' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '2026-12-25' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ example: 'Iglesia Principal' })
  @IsString()
  @IsOptional()
  lugar?: string;

  @ApiProperty({ example: 'Celebración navideña con toda la comunidad' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 'EP' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 'Se requiere confirmación de asistencia' })
  @IsString()
  @IsOptional()
  observacion?: string;
}
