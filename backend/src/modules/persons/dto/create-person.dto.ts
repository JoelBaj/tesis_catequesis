import { IsString, IsNotEmpty, IsDateString, IsEmail, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  cedula: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ example: '1990-01-15' })
  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  @ApiProperty({ example: 'Quito' })
  @IsString()
  @IsOptional()
  ciudadNacimiento?: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsOptional()
  localidadNacimiento?: string;

  @ApiProperty({ example: 'Calle Principal 123' })
  @IsString()
  @IsOptional()
  domicilio?: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  @IsOptional()
  correo?: string;

  @ApiProperty({ example: 'Masculino' })
  @IsString()
  @IsOptional()
  sexo?: string;

  @ApiProperty({ example: 'Ecuatoriana' })
  @IsString()
  @IsOptional()
  nacionalidad?: string;
}
