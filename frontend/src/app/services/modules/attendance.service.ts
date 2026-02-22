import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService, PaginatedResponse } from '@app/services/base.service';
import { Encounter, Attendance } from '@app/models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class EncountersService extends BaseService<Encounter> {
  protected override apiUrl = '/encounters';

  constructor(http: HttpClient) {
    super(http);
  }

  getByLevel(
    levelId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Encounter>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Encounter>>(
      `${environment.apiUrl}${this.apiUrl}/level/${levelId}`,
      { params },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AttendancesService extends BaseService<Attendance> {
  protected override apiUrl = '/attendances';

  constructor(http: HttpClient) {
    super(http);
  }

  getByEncounter(
    encounterId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Attendance>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Attendance>>(
      `${environment.apiUrl}${this.apiUrl}/encounter/${encounterId}`,
      { params },
    );
  }
}
