import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from '../services/enrollments.service';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Enrollment')
@ApiBearerAuth()
@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nueva matrícula' })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar matrículas con paginación y filtros' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.enrollmentsService.findAll(paginationDto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Obtener matrículas por estudiante' })
  findByStudent(@Param('studentId') studentId: string, @Query() paginationDto: PaginationDto) {
    return this.enrollmentsService.findByStudentId(+studentId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener matrícula por ID' })
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar matrícula' })
  update(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentsService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar matrícula' })
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
