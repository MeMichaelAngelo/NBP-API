import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FullCurrencyData } from '../interfaces/FullCurrencyData.interface';
import { environment } from '../environment/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NBPApiService {
  constructor(private http: HttpClient) {}

  fetchCurrentExchangeRates(): Observable<FullCurrencyData[]> {
    return this.http.get<FullCurrencyData[]>(`${environment.apiUrl}A/`);
  }

  fetchCurrencyFromDate(
    table: string,
    date: string
  ): Observable<FullCurrencyData[]> {
    return this.http.get<FullCurrencyData[]>(
      `${environment.apiUrl}${table}/${date}/`
    );
  }
}
