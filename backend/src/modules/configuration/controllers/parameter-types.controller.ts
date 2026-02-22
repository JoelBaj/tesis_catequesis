import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ParameterTypesService } from '../services/parameter-types.service';
import { CreateParameterTypeDto } from '../dto/create-parameter-type.dto';
import { UpdateParameterTypeDto } from '../dto/update-parameter-type.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Configuration')
@ApiBearerAuth()
@Controller('parameter-types')
@UseGuards(JwtAuthGuard)
export class ParameterTypesController {
  constructor(private readonly parameterTypesService: ParameterTypesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo tipo de parámetro' })
  create(@Body() createParameterTypeDto: CreateParameterTypeDto) {
    return this.parameterTypesService.create(createParameterTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de parámetros con paginación y filtros' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.parameterTypesService.findAll(paginationDto);
  }

  @Get('by-type/:type')
  @ApiOperation({ summary: 'Obtener parámetros por tipo' })
  findByType(@Param('type') type: string) {
    return this.parameterTypesService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de parámetro por ID' })
  findOne(@Param('id') id: string) {
    return this.parameterTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de parámetro' })
  update(@Param('id') id: string, @Body() updateParameterTypeDto: UpdateParameterTypeDto) {
    return this.parameterTypesService.update(+id, updateParameterTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar tipo de parámetro' })
  remove(@Param('id') id: string) {
    return this.parameterTypesService.remove(+id);
  }
}
