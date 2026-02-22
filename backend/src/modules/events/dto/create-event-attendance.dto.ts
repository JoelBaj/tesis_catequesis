import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  eventoId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  feligresId: number;

  @ApiProperty({ example: 'AA' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 'Asistió' })
  @IsString()
  @IsOptional()
  observacion?: string;
}
