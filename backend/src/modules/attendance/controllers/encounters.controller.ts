import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EncountersService } from '../services/encounters.service';
import { CreateEncounterDto } from '../dto/create-encounter.dto';
import { UpdateEncounterDto } from '../dto/update-encounter.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('encounters')
@UseGuards(JwtAuthGuard)
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo encuentro' })
  create(@Body() createEncounterDto: CreateEncounterDto) {
    return this.encountersService.create(createEncounterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar encuentros con paginación y filtros' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.encountersService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener encuentro por ID' })
  findOne(@Param('id') id: string) {
    return this.encountersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar encuentro' })
  update(@Param('id') id: string, @Body() updateEncounterDto: UpdateEncounterDto) {
    return this.encountersService.update(+id, updateEncounterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar encuentro' })
  remove(@Param('id') id: string) {
    return this.encountersService.remove(+id);
  }
}
