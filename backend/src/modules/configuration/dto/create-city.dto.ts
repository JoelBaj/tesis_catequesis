import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ example: 'Quito' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'QUI' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  provinceId: number;
}
