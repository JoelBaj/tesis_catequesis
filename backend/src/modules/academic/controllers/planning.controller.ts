import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlanningService } from '../services/planning.service';
import { CreatePlanningDto } from '../dto/create-planning.dto';
import { UpdatePlanningDto } from '../dto/update-planning.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Academic')
@ApiBearerAuth()
@Controller('planning')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nueva planificación' })
  create(@Body() createPlanningDto: CreatePlanningDto) {
    return this.planningService.create(createPlanningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar planificaciones con paginación y filtros' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.planningService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener planificación por ID' })
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar planificación' })
  update(@Param('id') id: string, @Body() updatePlanningDto: UpdatePlanningDto) {
    return this.planningService.update(+id, updatePlanningDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar planificación' })
  remove(@Param('id') id: string) {
    return this.planningService.remove(+id);
  }
}
