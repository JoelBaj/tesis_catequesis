import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export interface SendCourseNotificationPayload {
  courseId: number;
  periodo: string;
  parcial: string;
  tipo: string;
  asunto?: string;
  mensaje: string;
}

export interface SendAbsencesNotificationPayload {
  courseId: number;
  periodo: string;
  studentIds: number[];
  asunto?: string;
  mensaje: string;
}

export interface AbsenceStudent {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  absenceCount: number;
}

export interface GradeStudent {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  cualitativa: string;
  cuantitativa: number;
  observaciones: string;
}

export interface EnrolledStudent {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
}

export interface SendGradesNotificationPayload {
  courseId: number;
  periodo: string;
  parcial: string;
  studentIds: number[];
  subject?: string;
  message: string;
}

export interface SendEncounterNotificationPayload {
  courseId: number;
  studentIds: number[];
  subject?: string;
  message: string;
}

export interface ParentPerson {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
}

export interface SendEventNotificationPayload {
  personIds: number[];
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  sendCourse(payload: SendCourseNotificationPayload) {
    return this.http.post(`${this.apiUrl}/send-course`, payload);
  }

  getAbsences(courseId: number, periodo: string) {
    return this.http.get<AbsenceStudent[]>(`${this.apiUrl}/absences`, {
      params: { courseId: courseId.toString(), periodo },
    });
  }

  sendAbsences(payload: SendAbsencesNotificationPayload) {
    return this.http.post(`${this.apiUrl}/send-absences`, payload);
  }

  getGrades(courseId: number, periodo: string, parcial: string) {
    return this.http.get<GradeStudent[]>(`${this.apiUrl}/grades`, {
      params: { courseId: courseId.toString(), periodo, parcial },
    });
  }

  sendGrades(payload: SendGradesNotificationPayload) {
    return this.http.post(`${this.apiUrl}/send-grades`, payload);
  }

  getEnrolledStudents(courseId: number) {
    return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/enrolled-students`, {
      params: { courseId: courseId.toString() },
    });
  }

  sendEncounter(payload: SendEncounterNotificationPayload) {
    return this.http.post(`${this.apiUrl}/send-encounter`, payload);
  }

  getParentsRepresentatives() {
    return this.http.get<ParentPerson[]>(`${this.apiUrl}/parents-representatives`);
  }

  searchPersons(search: string) {
    return this.http.get<ParentPerson[]>(`${this.apiUrl}/search-persons`, {
      params: { search },
    });
  }

  sendEvent(payload: SendEventNotificationPayload) {
    return this.http.post(`${this.apiUrl}/send-event`, payload);
  }
}
