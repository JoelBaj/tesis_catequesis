import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinceDto {
  @ApiProperty({ example: 'Pichincha' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'PIC' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  countryId: number;
}
