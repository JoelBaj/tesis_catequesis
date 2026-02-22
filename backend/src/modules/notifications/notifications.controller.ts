import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { SendCourseNotificationDto } from './dto/send-course-notification.dto';
import { SendAbsencesNotificationDto } from './dto/send-absences-notification.dto';
import { SendGradesNotificationDto } from './dto/send-grades-notification.dto';
import { SendEncounterNotificationDto } from './dto/send-encounter-notification.dto';
import { SendEventNotificationDto } from './dto/send-event-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post('send-course')
  @ApiOperation({ summary: 'Enviar notificacion manual por curso' })
  sendCourse(@Body() dto: SendCourseNotificationDto) {
    return this.notificationsService.sendCourse(dto);
  }

  @Get('absences')
  @ApiOperation({ summary: 'Obtener estudiantes con mas de 2 faltas' })
  getAbsences(
    @Query('courseId') courseId: number,
    @Query('periodo') periodo: string,
  ) {
    return this.notificationsService.getStudentsWithAbsences(courseId, periodo);
  }

  @Get('enrolled-students')
  @ApiOperation({ summary: 'Obtener estudiantes matriculados en un curso' })
  getEnrolledStudents(@Query('courseId') courseId: number) {
    return this.notificationsService.getEnrolledStudents(courseId);
  }

  @Get('parents-representatives')
  @ApiOperation({ summary: 'Obtener padres y representantes de catequizandos' })
  getParentsRepresentatives() {
    return this.notificationsService.getParentsRepresentatives();
  }

  @Get('search-persons')
  @ApiOperation({ summary: 'Buscar feligreses para autocompletado' })
  searchPersons(@Query('search') search: string) {
    return this.notificationsService.searchPersons(search);
  }

  @Post('send-absences')
  @ApiOperation({ summary: 'Enviar notificacion de ausencias a estudiantes seleccionados' })
  sendAbsences(@Body() dto: SendAbsencesNotificationDto) {
    return this.notificationsService.sendAbsences(dto);
  }

  @Post('send-encounter')
  @ApiOperation({ summary: 'Enviar notificacion de encuentro a estudiantes seleccionados' })
  sendEncounter(@Body() dto: SendEncounterNotificationDto) {
    return this.notificationsService.sendEncounter(dto);
  }

  @Get('grades')
  @ApiOperation({ summary: 'Obtener calificaciones por curso, periodo y parcial' })
  getGrades(
    @Query('courseId') courseId: number,
    @Query('periodo') periodo: string,
    @Query('parcial') parcial: string,
  ) {
    return this.notificationsService.getGradesByCourse(courseId, periodo, parcial);
  }

  @Post('send-grades')
  @ApiOperation({ summary: 'Enviar notificacion de notas a estudiantes seleccionados' })
  sendGrades(@Body() dto: SendGradesNotificationDto) {
    return this.notificationsService.sendGrades(dto);
  }

  @Post('send-event')
  @ApiOperation({ summary: 'Enviar notificacion de evento a personas seleccionadas' })
  sendEvent(@Body() dto: SendEventNotificationDto) {
    return this.notificationsService.sendEvent(dto);
  }
}
