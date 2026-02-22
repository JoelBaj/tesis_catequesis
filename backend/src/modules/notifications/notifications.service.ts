import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Enrollment } from '@modules/enrollment/entities/enrollment.entity';
import { Student } from '@modules/persons/entities/student.entity';
import { Attendance } from '@modules/attendance/entities/attendance.entity';
import { Grade } from '@modules/academic/entities/grade.entity';
import { Person } from '@modules/persons/entities/person.entity';
import { SendCourseNotificationDto } from './dto/send-course-notification.dto';
import { SendAbsencesNotificationDto } from './dto/send-absences-notification.dto';
import { SendGradesNotificationDto } from './dto/send-grades-notification.dto';
import { SendEncounterNotificationDto } from './dto/send-encounter-notification.dto';
import { SendEventNotificationDto } from './dto/send-event-notification.dto';

interface RecipientInfo {
  email: string;
  parentName: string;
  childName: string;
  courseGroup: string;
  courseParallel: string;
  studentId: number;
}

interface EmailProvider {
  name: string;
  send: (params: {
    toEmail: string;
    toName?: string;
    subject: string;
    html: string;
  }) => Promise<void>;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
  ) {}

  async sendCourse(dto: SendCourseNotificationDto) {
    const enrollments = await this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.person', 'studentPerson')
      .leftJoinAndSelect('student.mother', 'mother')
      .leftJoinAndSelect('student.father', 'father')
      .leftJoinAndSelect('student.representative', 'representative')
      .leftJoinAndSelect('enrollment.course', 'course')
      .where('enrollment.cursoId = :courseId', { courseId: dto.courseId })
      .getMany();

    const recipients = this.buildRecipients(enrollments);
    if (recipients.length === 0) {
      return {
        sent: 0,
        failed: 0,
        message: 'No se encontraron correos de padres para este curso',
      };
    }

    const providers = this.getProviders();
    if (providers.length === 0) {
      return {
        sent: 0,
        failed: recipients.length,
        message: 'No hay proveedores configurados para envio de correos',
      };
    }

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const recipient of recipients) {
      const subject = this.buildSubject(dto, recipient);
      const html = this.buildHtml(dto, recipient);

      try {
        await this.sendWithFallback(providers, {
          toEmail: recipient.email,
          toName: recipient.parentName,
          subject,
          html,
        });
        sent += 1;
      } catch (error: any) {
        failed += 1;
        errors.push({
          email: recipient.email,
          error: error?.message || 'Error desconocido',
        });
      }
    }

    return {
      sent,
      failed,
      message: sent > 0 ? 'Notificaciones enviadas' : 'No se pudo enviar',
      errors,
    };
  }

  private buildRecipients(enrollments: Enrollment[]): RecipientInfo[] {
    const recipients: RecipientInfo[] = [];
    const seen = new Set<string>();

    enrollments.forEach((enrollment) => {
      const student = enrollment.student;
      if (!student) return;

      const childName = [student.person?.nombres, student.person?.apellidos]
        .filter(Boolean)
        .join(' ') || 'Catequizando';
      const courseGroup = enrollment.course?.grupo || '';
      const courseParallel = enrollment.course?.paralelo || '';

      const parents = [student.mother, student.father, student.representative];
      parents.forEach((parent) => {
        const email = parent?.correo?.trim();
        if (!email) return;

        const key = `${email.toLowerCase()}|${student.id}`;
        if (seen.has(key)) return;
        seen.add(key);

        const parentName = [parent?.nombres, parent?.apellidos]
          .filter(Boolean)
          .join(' ') || 'Padre/Madre';

        recipients.push({
          email,
          parentName,
          childName,
          courseGroup,
          courseParallel,
          studentId: student.id,
        });
      });
    });

    return recipients;
  }

  private buildSubject(dto: SendCourseNotificationDto, recipient: RecipientInfo): string {
    if (dto.asunto?.trim()) {
      return dto.asunto.trim();
    }

    const courseLabel = `${recipient.courseGroup} ${recipient.courseParallel}`.trim();
    return `Notificacion ${dto.tipo} - Curso ${courseLabel || dto.courseId}`;
  }

  private buildHtml(dto: SendCourseNotificationDto, recipient: RecipientInfo): string {
    const courseLabel = `${recipient.courseGroup} ${recipient.courseParallel}`.trim();
    const parishName = process.env.NOTIFICATIONS_PARISH_NAME || 'Parroquia';
    const periodoInfo = dto.periodo ? `, periodo <strong>${dto.periodo}</strong>` : '';
    const parcialInfo = dto.parcial ? ` y parcial <strong>${dto.parcial}</strong>` : '';

    return `
      <p>Estimado/a ${recipient.parentName},</p>
      <p>
        Le informamos sobre <strong>${dto.tipo}</strong> para el estudiante
        <strong>${recipient.childName}</strong> del curso
        <strong>${courseLabel || dto.courseId}</strong>${periodoInfo}${parcialInfo}.
      </p>
      <p>${dto.mensaje}</p>
      <p>Atentamente,<br />${parishName}</p>
    `;
  }

  private async sendWithFallback(
    providers: EmailProvider[],
    payload: { toEmail: string; toName?: string; subject: string; html: string },
  ) {
    let lastError: Error | null = null;
    for (const provider of providers) {
      try {
        await provider.send(payload);
        return provider.name;
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error('Error al enviar correo');
      }
    }

    throw lastError || new Error('Sin proveedores disponibles');
  }

  private getProviders(): EmailProvider[] {
    const fromEmail = process.env.NOTIFICATIONS_FROM_EMAIL || '';
    const fromName = process.env.NOTIFICATIONS_FROM_NAME || 'Parroquia';
    const providers: EmailProvider[] = [];

    // Amazon SES
    const sesKey = process.env.AWS_SES_ACCESS_KEY_ID;
    const sesSecret = process.env.AWS_SES_SECRET_ACCESS_KEY;
    const sesRegion = process.env.AWS_SES_REGION;
    if (sesKey && sesSecret && sesRegion && fromEmail) {
      const { AmazonSESProvider } = require('./amazon-ses.provider');
      const sesProvider = new AmazonSESProvider({
        accessKeyId: sesKey,
        secretAccessKey: sesSecret,
        region: sesRegion,
        fromEmail,
        fromName,
      });
      providers.push({
        name: 'amazon-ses',
        send: async ({ toEmail, subject, html }) => {
          await sesProvider.send({ toEmail, subject, html });
        },
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && fromEmail) {
      providers.push({
        name: 'resend',
        send: async ({ toEmail, subject, html }) => {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: `${fromName} <${fromEmail}>`,
              to: [toEmail],
              subject,
              html,
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Resend error: ${text}`);
          }
        },
      });
    }

    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey && fromEmail) {
      providers.push({
        name: 'brevo',
        send: async ({ toEmail, toName, subject, html }) => {
          const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': brevoKey,
            },
            body: JSON.stringify({
              sender: { name: fromName, email: fromEmail },
              to: [{ email: toEmail, name: toName || toEmail }],
              subject,
              htmlContent: html,
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Brevo error: ${text}`);
          }
        },
      });
    }

    const mailerSendKey = process.env.MAILERSEND_API_KEY;
    if (mailerSendKey && fromEmail) {
      providers.push({
        name: 'mailersend',
        send: async ({ toEmail, toName, subject, html }) => {
          const response = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${mailerSendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: { email: fromEmail, name: fromName },
              to: [{ email: toEmail, name: toName || toEmail }],
              subject,
              html,
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`MailerSend error: ${text}`);
          }
        },
      });
    }

    const mailgunKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    if (mailgunKey && mailgunDomain && fromEmail) {
      providers.push({
        name: 'mailgun',
        send: async ({ toEmail, subject, html }) => {
          const params = new URLSearchParams();
          params.append('from', `${fromName} <${fromEmail}>`);
          params.append('to', toEmail);
          params.append('subject', subject);
          params.append('html', html);

          const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(`api:${mailgunKey}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Mailgun error: ${text}`);
          }
        },
      });
    }

    return providers;
  }

  async getStudentsWithAbsences(courseId: number, periodo: string) {
    const absences = await this.attendancesRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.encounter', 'encounter')
      .leftJoin('encounter.course', 'course')
      .leftJoin('attendance.student', 'student')
      .leftJoin('student.person', 'person')
      .select('student.id', 'studentId')
      .addSelect('person.nombres', 'nombres')
      .addSelect('person.apellidos', 'apellidos')
      .addSelect('person.correo', 'correo')
      .addSelect('COUNT(attendance.id)', 'absenceCount')
      .where('encounter.cursoId = :courseId', { courseId })
      .andWhere('course.periodo = :periodo', { periodo })
      .andWhere('attendance.estado = :estado', { estado: 'AF' })
      .groupBy('student.id')
      .addGroupBy('person.nombres')
      .addGroupBy('person.apellidos')
      .addGroupBy('person.correo')
      .having('COUNT(attendance.id) > 2')
      .getRawMany();

    return absences.map((item) => ({
      id: item.studentId,
      nombres: item.nombres,
      apellidos: item.apellidos,
      correo: item.correo || '',
      absenceCount: parseInt(item.absenceCount, 10),
    }));
  }

  async getEnrolledStudents(courseId: number) {
    const enrollments = await this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoin('enrollment.student', 'student')
      .leftJoin('student.person', 'person')
      .select('student.id', 'studentId')
      .addSelect('person.nombres', 'nombres')
      .addSelect('person.apellidos', 'apellidos')
      .addSelect('person.cedula', 'cedula')
      .addSelect('person.correo', 'correo')
      .where('enrollment.cursoId = :courseId', { courseId })
      .orderBy('person.apellidos', 'ASC')
      .addOrderBy('person.nombres', 'ASC')
      .getRawMany();

    return enrollments.map((item) => ({
      id: item.studentId,
      nombres: item.nombres,
      apellidos: item.apellidos,
      cedula: item.cedula || '',
      correo: item.correo || '',
    }));
  }

  async sendAbsences(dto: SendAbsencesNotificationDto) {
    const enrollments = await this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.mother', 'mother')
      .leftJoinAndSelect('student.father', 'father')
      .leftJoinAndSelect('student.representative', 'representative')
      .leftJoinAndSelect('enrollment.course', 'course')
      .where('student.id IN (:...studentIds)', { studentIds: dto.studentIds })
      .andWhere('enrollment.cursoId = :courseId', { courseId: dto.courseId })
      .getMany();

    const recipients = this.buildRecipients(enrollments);
    if (recipients.length === 0) {
      return {
        sent: 0,
        failed: 0,
        message: 'No se encontraron correos de padres para los estudiantes seleccionados',
      };
    }

    const providers = this.getProviders();
    if (providers.length === 0) {
      return {
        sent: 0,
        failed: recipients.length,
        message: 'No hay proveedores configurados para envio de correos',
      };
    }

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const recipient of recipients) {
      const fakeDto = {
        courseId: dto.courseId,
        periodo: dto.periodo,
        parcial: '',
        tipo: 'Inasistencias',
        asunto: dto.asunto,
        mensaje: dto.mensaje,
      };
      const subject = this.buildSubject(fakeDto as any, recipient);
      const html = this.buildHtml(fakeDto as any, recipient);

      try {
        await this.sendWithFallback(providers, {
          toEmail: recipient.email,
          toName: recipient.parentName,
          subject,
          html,
        });
        sent += 1;
      } catch (error: any) {
        failed += 1;
        errors.push({
          email: recipient.email,
          error: error?.message || 'Error desconocido',
        });
      }
    }

    return {
      sent,
      failed,
      message: sent > 0 ? 'Notificaciones enviadas' : 'No se pudo enviar',
      errors,
    };
  }

  async getGradesByCourse(courseId: number, periodo: string, parcial: string) {
    const queryBuilder = this.gradesRepository
      .createQueryBuilder('grade')
      .leftJoin('grade.student', 'student')
      .leftJoin('student.person', 'person')
      .select('student.id', 'studentId')
      .addSelect('person.nombres', 'nombres')
      .addSelect('person.apellidos', 'apellidos')
      .addSelect('person.correo', 'correo')
      .addSelect('grade.cualitativa', 'cualitativa')
      .addSelect('grade.cuantitativa', 'cuantitativa')
      .addSelect('grade.observaciones', 'observaciones')
      .where('grade.cursoId = :courseId', { courseId })
      .andWhere('grade.periodo = :periodo', { periodo });

    if (parcial) {
      queryBuilder.andWhere('grade.parcial = :parcial', { parcial });
    }

    const grades = await queryBuilder.getRawMany();

    return grades.map((item) => ({
      id: item.studentId,
      nombres: item.nombres,
      apellidos: item.apellidos,
      correo: item.correo || '',
      cualitativa: item.cualitativa,
      cuantitativa: parseFloat(item.cuantitativa) || 0,
      observaciones: item.observaciones || '',
    }));
  }

  async sendGrades(dto: SendGradesNotificationDto) {
    const enrollments = await this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.mother', 'mother')
      .leftJoinAndSelect('student.father', 'father')
      .leftJoinAndSelect('student.representative', 'representative')
      .leftJoinAndSelect('enrollment.course', 'course')
      .where('student.id IN (:...studentIds)', { studentIds: dto.studentIds })
      .andWhere('enrollment.cursoId = :courseId', { courseId: dto.courseId })
      .getMany();

    const recipients = this.buildRecipients(enrollments);
    if (recipients.length === 0) {
      return {
        sent: 0,
        failed: 0,
        message: 'No se encontraron correos de padres para los estudiantes seleccionados',
      };
    }

    // Obtener todas las notas de los estudiantes seleccionados
    const grades = await this.gradesRepository
      .createQueryBuilder('grade')
      .leftJoin('grade.student', 'student')
      .select('student.id', 'studentId')
      .addSelect('grade.tareas', 'tareas')
      .addSelect('grade.lecciones', 'lecciones')
      .addSelect('grade.evaluacionOral', 'evaluacionOral')
      .addSelect('grade.evaluacionEscrita', 'evaluacionEscrita')
      .addSelect('grade.cualitativa', 'cualitativa')
      .addSelect('grade.cuantitativa', 'cuantitativa')
      .addSelect('grade.observaciones', 'observaciones')
      .where('grade.cursoId = :courseId', { courseId: dto.courseId })
      .andWhere('grade.periodo = :periodo', { periodo: dto.periodo })
      .andWhere('student.id IN (:...studentIds)', { studentIds: dto.studentIds })
      .andWhere(dto.parcial ? 'grade.parcial = :parcial' : '1=1', { parcial: dto.parcial })
      .getRawMany();

    // Mapear notas por estudiante
    const gradesByStudent: Record<number, any> = {};
    grades.forEach((g) => {
      gradesByStudent[g.studentId] = g;
    });

    const providers = this.getProviders();
    if (providers.length === 0) {
      return {
        sent: 0,
        failed: recipients.length,
        message: 'No hay proveedores configurados para envio de correos',
      };
    }

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const recipient of recipients) {
      const fakeDto = {
        courseId: dto.courseId,
        periodo: dto.periodo,
        parcial: dto.parcial,
        tipo: 'Notas',
        asunto: dto.subject,
        mensaje: dto.message,
      };
      const subject = this.buildSubject(fakeDto as any, recipient);
      const html = this.buildGradesHtml(fakeDto as any, recipient, gradesByStudent, dto);

      try {
        await this.sendWithFallback(providers, {
          toEmail: recipient.email,
          toName: recipient.parentName,
          subject,
          html,
        });
        sent += 1;
      } catch (error: any) {
        failed += 1;
        errors.push({
          email: recipient.email,
          error: error?.message || 'Error desconocido',
        });
      }
    }

    return {
      sent,
      failed,
      message: sent > 0 ? 'Notificaciones enviadas' : 'No se pudo enviar',
      errors,
    };
  }
  /**
   * Construye el HTML del correo de notas, incluyendo la tabla de calificaciones.
   */
  private buildGradesHtml(dto: SendCourseNotificationDto, recipient: RecipientInfo, gradesByStudent: Record<number, any>, originalDto: any): string {
    const courseLabel = `${recipient.courseGroup} ${recipient.courseParallel}`.trim();
    const parishName = process.env.NOTIFICATIONS_PARISH_NAME || 'Parroquia';
    const periodoInfo = dto.periodo ? `, periodo <strong>${dto.periodo}</strong>` : '';
    const parcialInfo = dto.parcial ? ` y parcial <strong>${dto.parcial}</strong>` : '';

    // Buscar la nota del estudiante por studentId
    let gradeHtml = '<p><strong>No se encontró calificación para este estudiante.</strong></p>';
    const studentGrade = gradesByStudent[recipient.studentId];
    if (studentGrade) {
      gradeHtml = this.renderGradeTable(studentGrade);
    }

    return `
      <p>Estimado/a ${recipient.parentName},</p>
      <p>
        Le informamos sobre <strong>${dto.tipo}</strong> para el estudiante
        <strong>${recipient.childName}</strong> del curso
        <strong>${courseLabel || dto.courseId}</strong>${periodoInfo}${parcialInfo}.
      </p>
      <p>${dto.mensaje}</p>
      ${gradeHtml}
      <p>Atentamente,<br />${parishName}</p>
    `;
  }

  /**
   * Renderiza la tabla HTML de la nota de un estudiante
   */
  private renderGradeTable(grade: any): string {
    if (!grade) {
      return '<p><strong>No se encontró calificación para este estudiante.</strong></p>';
    }
    return `
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin: 10px 0;">
        <tr>
          <th>Tareas</th>
          <th>Lecciones</th>
          <th>Eval. Oral</th>
          <th>Eval. Escrita</th>
          <th>Nota Cualitativa</th>
          <th>Nota Cuantitativa</th>
          <th>Observaciones</th>
        </tr>
        <tr>
          <td>${grade.tareas ?? '-'}</td>
          <td>${grade.lecciones ?? '-'}</td>
          <td>${grade.evaluacionOral ?? '-'}</td>
          <td>${grade.evaluacionEscrita ?? '-'}</td>
          <td>${grade.cualitativa ?? '-'}</td>
          <td>${grade.cuantitativa ?? '-'}</td>
          <td>${grade.observaciones ?? '-'}</td>
        </tr>
      </table>
    `;
  }

  async sendEncounter(dto: SendEncounterNotificationDto) {
    const enrollments = await this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.mother', 'mother')
      .leftJoinAndSelect('student.father', 'father')
      .leftJoinAndSelect('student.representative', 'representative')
      .leftJoinAndSelect('enrollment.course', 'course')
      .where('student.id IN (:...studentIds)', { studentIds: dto.studentIds })
      .andWhere('enrollment.cursoId = :courseId', { courseId: dto.courseId })
      .getMany();

    const recipients = this.buildRecipients(enrollments);
    if (recipients.length === 0) {
      return {
        sent: 0,
        failed: 0,
        message: 'No se encontraron correos de padres para los estudiantes seleccionados',
      };
    }

    const providers = this.getProviders();
    if (providers.length === 0) {
      return {
        sent: 0,
        failed: recipients.length,
        message: 'No hay proveedores configurados para envio de correos',
      };
    }

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const recipient of recipients) {
      const fakeDto = {
        courseId: dto.courseId,
        periodo: '',
        parcial: '',
        tipo: 'Encuentro',
        asunto: dto.subject,
        mensaje: dto.message,
      };
      const subject = this.buildSubject(fakeDto as any, recipient);
      const html = this.buildHtml(fakeDto as any, recipient);

      try {
        await this.sendWithFallback(providers, {
          toEmail: recipient.email,
          toName: recipient.parentName,
          subject,
          html,
        });
        sent += 1;
      } catch (error: any) {
        failed += 1;
        errors.push({
          email: recipient.email,
          error: error?.message || 'Error desconocido',
        });
      }
    }

    return {
      sent,
      failed,
      message: sent > 0 ? 'Notificaciones enviadas' : 'No se pudo enviar',
      errors,
    };
  }

  async getParentsRepresentatives() {
    // Obtener todos los estudiantes con sus relaciones de padres
    const students = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.mother', 'mother')
      .leftJoinAndSelect('student.father', 'father')
      .leftJoinAndSelect('student.representative', 'representative')
      .getMany();

    const personsMap = new Map<number, any>();

    students.forEach((student) => {
      const parents = [student.mother, student.father, student.representative].filter(Boolean);
      
      parents.forEach((parent) => {
        if (parent && parent.id && !personsMap.has(parent.id)) {
          personsMap.set(parent.id, {
            id: parent.id,
            nombres: parent.nombres,
            apellidos: parent.apellidos,
            cedula: parent.cedula || '',
            correo: parent.correo || '',
          });
        }
      });
    });

    return Array.from(personsMap.values()).sort((a, b) => 
      (a.apellidos + a.nombres).localeCompare(b.apellidos + b.nombres)
    );
  }

  async searchPersons(search: string) {
    if (!search || search.trim().length < 2) {
      return [];
    }

    const searchTerm = `%${search.trim()}%`;
    
    const persons = await this.personsRepository
      .createQueryBuilder('person')
      .where('person.nombres LIKE :search', { search: searchTerm })
      .orWhere('person.apellidos LIKE :search', { search: searchTerm })
      .orWhere('person.cedula LIKE :search', { search: searchTerm })
      .orWhere('person.correo LIKE :search', { search: searchTerm })
      .orderBy('person.apellidos', 'ASC')
      .addOrderBy('person.nombres', 'ASC')
      .limit(20)
      .getMany();

    return persons.map((person) => ({
      id: person.id,
      nombres: person.nombres,
      apellidos: person.apellidos,
      cedula: person.cedula || '',
      correo: person.correo || '',
    }));
  }

  async sendEvent(dto: SendEventNotificationDto) {
    const { personIds, subject, message } = dto;

    if (!personIds || personIds.length === 0) {
      return {
        sent: 0,
        failed: 0,
        message: 'No se seleccionaron personas',
        errors: [],
      };
    }

    // Get all selected persons
    const persons = await this.personsRepository
      .createQueryBuilder('person')
      .whereInIds(personIds)
      .getMany();

    // Get email providers
    const providers = this.getProviders();

    let sent = 0;
    let failed = 0;
    const errors: any[] = [];

    // Send to each person with a valid email
    for (const person of persons) {
      if (!person.correo) {
        failed += 1;
        errors.push({
          email: 'N/A',
          personName: `${person.nombres} ${person.apellidos}`,
          error: 'Sin correo registrado',
        });
        continue;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="color: #555;">Estimado/a ${person.nombres} ${person.apellidos},</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${message}
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 30px;">
            Este es un mensaje automático de la Parroquia.
          </p>
        </div>
      `;

      try {
        await this.sendWithFallback(providers, {
          toEmail: person.correo,
          toName: `${person.nombres} ${person.apellidos}`,
          subject,
          html,
        });
        sent += 1;
      } catch (error: any) {
        failed += 1;
        errors.push({
          email: person.correo,
          personName: `${person.nombres} ${person.apellidos}`,
          error: error?.message || 'Error desconocido',
        });
      }
    }

    return {
      sent,
      failed,
      message: sent > 0 ? 'Notificaciones enviadas' : 'No se pudo enviar',
      errors,
    };
  }
}
