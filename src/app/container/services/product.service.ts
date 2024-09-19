import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IProductPagination } from '../interfaces/product.pagination';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productRL = `${environment.serverUrl}/product`;
  
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
  });
  
  constructor(private httpClient: HttpClient) { }

  getProductPagination(
    page: number, 
    limit: number,
    current: string
  ): Observable<IProductPagination> {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('current', current);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.get<IProductPagination>(`${this.productRL}/filter/pagination`, { params, headers });
  }
}
