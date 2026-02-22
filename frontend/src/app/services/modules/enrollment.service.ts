import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService, PaginatedResponse } from '@app/services/base.service';
import { Enrollment } from '@app/models/enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService extends BaseService<Enrollment> {
  protected override apiUrl = '/enrollments';

  constructor(http: HttpClient) {
    super(http);
  }

  getByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Enrollment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Enrollment>>(
      `${environment.apiUrl}${this.apiUrl}/student/${studentId}`,
      { params },
    );
  }
}
