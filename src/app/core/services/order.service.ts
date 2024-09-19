import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IOrder } from '../interfaces/order.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderURL = environment.serverUrl + '/order';

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  createOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.orderURL, order, {headers: this.headers});
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.orderURL}/${id}`);
  }

  getOrdersByUserId(userId: string): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.orderURL}/all/${userId}`, {headers: this.headers});
  }
}