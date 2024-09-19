import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IProduct } from '../../interfaces/product.interface';
import { ProductFilters } from './product.filter.interface';
import { IColorModel } from '../../interfaces/color-model.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productRL = `${environment.serverUrl}/product`;
  
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
  });
  
  constructor(private http: HttpClient) { }

  searchProducts(filters: ProductFilters): Observable<{ data: IProduct[], total: number, page: number, pageSize: number }> {
    let params = new HttpParams();

    // Agrega los filtros a los parámetros HTTP si existen
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, filters[key]!.toString()); // Agrega el operador "!" para indicar que no es nulo
      }
    });

    return this.http.get<{ data: IProduct[], total: number, page: number, pageSize: number }>(this.productRL, { params });
  }

  getProductByIdentifier(identifier: string): Observable<IProduct> {
    // return this.http.get(`${this.productRL}/identifier/${identifier}`, { headers: this.headers }).pipe(catchError(this.handleError));
    return this.http.get<IProduct>(`${this.productRL}/${identifier}`, { headers: this.headers });
  }

  getModelByIdentifier(identifier: string): Observable<IColorModel> {
    // return this.http.get(`${this.productRL}/identifier/${identifier}`, { headers: this.headers }).pipe(catchError(this.handleError));
    return this.http.get<IColorModel>(`${this.productRL}/model/${identifier}`, { headers: this.headers });
  }

  getProductsByCategory(category: string): Observable<IProduct[]> {
    // return this.http.get(`${this.productRL}/category/${category}`, { headers: this.headers  }).pipe(catchError(this.handleError));
    return this.http.get<IProduct[]>(`${this.productRL}/category/${category}`, { headers: this.headers  });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}


