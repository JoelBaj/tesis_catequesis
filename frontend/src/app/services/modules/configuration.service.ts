import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService, PaginatedResponse } from '@app/services/base.service';
import { Country, Province, City, ParameterType } from '@app/models/configuration.model';

@Injectable({
  providedIn: 'root',
})
export class CountriesService extends BaseService<Country> {
  protected override apiUrl = '/countries';

  constructor(http: HttpClient) {
    super(http);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProvincesService extends BaseService<Province> {
  protected override apiUrl = '/provinces';

  constructor(http: HttpClient) {
    super(http);
  }

  getByCountry(
    countryId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Province>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Province>>(
      `${environment.apiUrl}${this.apiUrl}/country/${countryId}`,
      { params },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class CitiesService extends BaseService<City> {
  protected override apiUrl = '/cities';

  constructor(http: HttpClient) {
    super(http);
  }

  getByProvince(
    provinceId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<City>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<City>>(
      `${environment.apiUrl}${this.apiUrl}/province/${provinceId}`,
      { params },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ParameterTypesService extends BaseService<ParameterType> {
  protected override apiUrl = '/parameter-types';

  constructor(http: HttpClient) {
    super(http);
  }

  getByType(type: string): Observable<ParameterType[]> {
    return this.http.get<ParameterType[]>(
      `${environment.apiUrl}${this.apiUrl}/by-type/${type}`,
    );
  }
}
