import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProvincesService } from '../services/provinces.service';
import { CreateProvinceDto } from '../dto/create-province.dto';
import { UpdateProvinceDto } from '../dto/update-province.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Configuration')
@ApiBearerAuth()
@Controller('provinces')
@UseGuards(JwtAuthGuard)
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nueva provincia' })
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provincesService.create(createProvinceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar provincias con paginación y filtros' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.provincesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener provincia por ID' })
  findOne(@Param('id') id: string) {
    return this.provincesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar provincia' })
  update(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provincesService.update(+id, updateProvinceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar provincia' })
  remove(@Param('id') id: string) {
    return this.provincesService.remove(+id);
  }
}
