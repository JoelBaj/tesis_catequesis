import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventAttendancesService } from '../services/event-attendances.service';
import { CreateEventAttendanceDto } from '../dto/create-event-attendance.dto';
import { UpdateEventAttendanceDto } from '../dto/update-event-attendance.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('event-attendances')
@UseGuards(JwtAuthGuard)
export class EventAttendancesController {
  constructor(private readonly eventAttendancesService: EventAttendancesService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar asistencia a evento' })
  create(@Body() createEventAttendanceDto: CreateEventAttendanceDto) {
    return this.eventAttendancesService.create(createEventAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar asistencias a eventos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.eventAttendancesService.findAll(paginationDto);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Obtener asistencias por evento' })
  findByEvent(@Param('eventId') eventId: string, @Query() paginationDto: PaginationDto) {
    return this.eventAttendancesService.findByEventId(+eventId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener asistencia a evento por ID' })
  findOne(@Param('id') id: string) {
    return this.eventAttendancesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asistencia a evento' })
  update(@Param('id') id: string, @Body() updateEventAttendanceDto: UpdateEventAttendanceDto) {
    return this.eventAttendancesService.update(+id, updateEventAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar asistencia a evento' })
  remove(@Param('id') id: string) {
    return this.eventAttendancesService.remove(+id);
  }
}
