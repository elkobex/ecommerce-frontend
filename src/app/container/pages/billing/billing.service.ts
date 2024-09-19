import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { ICard } from './card.interface';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  // private baseUrl = `${environment.serverUrl}/user/cc`;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
  });

  constructor(private http: HttpClient) {}
}
