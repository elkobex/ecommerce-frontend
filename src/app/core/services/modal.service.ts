import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProduct } from '../../container/interfaces/product.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private authURL = environment.serverUrl + '/user';
  private displayModalSubject = new BehaviorSubject<boolean>(false);
  private displayDetailModalSubject = new BehaviorSubject<{status: boolean, product: IProduct}>({
    status: false,
    product: {} as IProduct
  });

  private displayAddressModalSubject = new BehaviorSubject<{status: boolean, user: IUser | null}>({
    status: false,
    user: null
  });

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
  });

  constructor(private http: HttpClient) { }

  getModalStatus(){
    return this.displayModalSubject.asObservable();
  }

  getModalDetailStatus(){
    return this.displayDetailModalSubject.asObservable();
  }

  showDetailModal(product: IProduct): void {
    this.displayDetailModalSubject.next({status: true, product});
  }

  hideDetailModal(): void {
    this.displayDetailModalSubject.next({status: false, product: {} as IProduct});
  }

  getModalAddressStatus(){
    return this.displayAddressModalSubject.asObservable();
  }

  showAddressModal(user: IUser | null): void {
    this.displayAddressModalSubject.next({status: true, user});
  }

  hideAddressModal(): void {
    this.displayAddressModalSubject.next({status: false, user: null});
  }
  
  // Este método se utiliza para mostrar el modal
  showModal(): void {
    this.displayModalSubject.next(true);
  }

  // Este método se utiliza para ocultar el modal
  hideModal(): void {
    this.displayModalSubject.next(false);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.authURL}/login`, loginData, {headers : this.headers});
  }

  register(registerData: any): Observable<any> {
    return this.http.post(`${this.authURL}/register`, registerData, {headers : this.headers});
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.authURL}/forget-password`, { email }, {headers : this.headers});
  }
}