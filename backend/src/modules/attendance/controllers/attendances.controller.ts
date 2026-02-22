import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendancesService } from '../services/attendances.service';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar asistencia' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar asistencias con paginación' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.attendancesService.findAll(paginationDto);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Obtener asistencias por encuentro' })
  findByEncounter(@Param('encounterId') encounterId: string, @Query() paginationDto: PaginationDto) {
    return this.attendancesService.findByEncounterId(+encounterId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener asistencia por ID' })
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asistencia' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendancesService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar asistencia' })
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
