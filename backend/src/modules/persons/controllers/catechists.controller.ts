import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatechistsService } from '../services/catechists.service';
import { CreateCatechistDto } from '../dto/create-catechist.dto';
import { UpdateCatechistDto } from '../dto/update-catechist.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Persons')
@ApiBearerAuth()
@Controller('catechists')
@UseGuards(JwtAuthGuard)
export class CatechistsController {
  constructor(private readonly catechistsService: CatechistsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo catequista' })
  create(@Body() createCatechistDto: CreateCatechistDto) {
    return this.catechistsService.create(createCatechistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar catequistas con paginación y filtros' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.catechistsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener catequista por ID' })
  findOne(@Param('id') id: string) {
    return this.catechistsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar catequista' })
  update(@Param('id') id: string, @Body() updateCatechistDto: UpdateCatechistDto) {
    return this.catechistsService.update(+id, updateCatechistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar catequista' })
  remove(@Param('id') id: string) {
    return this.catechistsService.remove(+id);
  }
}
