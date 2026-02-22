import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected apiUrl: string = '';

  constructor(protected http: HttpClient) {}

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${this.apiUrl}`, data);
  }

  /**
   * Método helper para obtener datos desde el evento del grid
   */
  getAllFromEvent(event: any): Observable<PaginatedResponse<T>> {
    const page = ((event.first || 0) / (event.rows || 10)) + 1;
    const limit = event.rows || 10;
    const search = event.globalFilter || undefined;
    const sortBy = event.sortField || undefined;
    const sortOrder = event.sortOrder === 1 ? 'ASC' : event.sortOrder === -1 ? 'DESC' : undefined;

    return this.getAll(page, limit, search, sortBy, sortOrder);
  }

  getAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
    periodo?: string
  ): Observable<PaginatedResponse<T>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    if (periodo) {
      params = params.set('periodo', periodo);
    }

    return this.http.get<PaginatedResponse<T>>(`${environment.apiUrl}${this.apiUrl}`, {
      params,
    });
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${this.apiUrl}/${id}`);
  }

  update(id: number | string, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${environment.apiUrl}${this.apiUrl}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${this.apiUrl}/${id}`);
  }
}
