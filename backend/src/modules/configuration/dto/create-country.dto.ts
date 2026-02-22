import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ example: 'Ecuador' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'EC' })
  @IsString()
  @Length(2, 3)
  @IsNotEmpty()
  code: string;
}
