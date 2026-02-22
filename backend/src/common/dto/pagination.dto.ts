import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ example: 'search term', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ example: '2024', required: false, description: 'Filtrar por período' })
  @IsString()
  @IsOptional()
  periodo?: string;

  @ApiProperty({ example: 'name', required: false, description: 'Campo para ordenar' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ example: 'ASC', required: false, enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
