import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService, PaginatedResponse } from '@app/services/base.service';
import { Course, Subject, Level, Planning, Grade } from '@app/models/academic.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService extends BaseService<Course> {
  protected override apiUrl = '/courses';

  constructor(http: HttpClient) {
    super(http);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SubjectsService extends BaseService<Subject> {
  protected override apiUrl = '/subjects';

  constructor(http: HttpClient) {
    super(http);
  }

  getByCourse(
    courseId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Subject>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Subject>>(
      `${environment.apiUrl}${this.apiUrl}/course/${courseId}`,
      { params },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class LevelsService extends BaseService<Level> {
  protected override apiUrl = '/levels';

  constructor(http: HttpClient) {
    super(http);
  }

  getBySubject(
    subjectId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Level>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Level>>(
      `${environment.apiUrl}${this.apiUrl}/subject/${subjectId}`,
      { params },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class PlanningService extends BaseService<Planning> {
  protected override apiUrl = '/planning';

  constructor(http: HttpClient) {
    super(http);
  }

  getByLevel(
    levelId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Planning>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Planning>>(
      `${environment.apiUrl}${this.apiUrl}/level/${levelId}`,
      { params },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class GradesService extends BaseService<Grade> {
  protected override apiUrl = '/grades';

  constructor(http: HttpClient) {
    super(http);
  }
}
