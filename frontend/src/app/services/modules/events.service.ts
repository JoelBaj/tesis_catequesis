import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService, PaginatedResponse } from '@app/services/base.service';
import { Event, EventAttendance } from '@app/models/events.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends BaseService<Event> {
  protected override apiUrl = '/events';

  constructor(http: HttpClient) {
    super(http);
  }
}

@Injectable({
  providedIn: 'root',
})
export class EventAttendancesService extends BaseService<EventAttendance> {
  protected override apiUrl = '/event-attendances';

  constructor(http: HttpClient) {
    super(http);
  }

  getByEvent(
    eventId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<EventAttendance>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<EventAttendance>>(
      `${environment.apiUrl}${this.apiUrl}/event/${eventId}`,
      { params },
    );
  }
}
