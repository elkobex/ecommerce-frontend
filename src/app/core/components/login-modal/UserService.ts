import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/users'; // Asegúrate de usar la URL correcta de tu API

  constructor(private http: HttpClient) { }

  

  addItemToCart(userId: string, itemData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-item-to-cart/${userId}`, itemData);
  }

  showItemsInCart(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/show-items-in-cart/${userId}`);
  }

  deleteItemFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-item-from-cart/${userId}/${productId}`);
  }

  deleteAllItemsFromCart(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-all-items-from-cart/${userId}`);
  }

  modifyItemInCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/modify-item-in-cart/${userId}/${productId}`, { quantity });
  }

  updateUserInfo(userId: string, updateData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-user-info/${userId}`, updateData);
  }

  getUserInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-user-info/${userId}`);
  }
}
