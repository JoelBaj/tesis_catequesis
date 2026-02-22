import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  encuentroId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  catequizandoId: number;

  @ApiProperty({ example: 'AA' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 'Llegó a tiempo' })
  @IsString()
  @IsOptional()
  observacion?: string;
}
