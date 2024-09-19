import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { IUser } from '../interfaces/user.interface';
import { IAddress } from '../interfaces/address.interface';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = environment.serverUrl + '/user';
  private loggedIn = new BehaviorSubject<boolean>(this.checkInitialLoginState());

  private router = inject(Router);
  private navigationSrv = inject(NavigationService);

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
  });

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private encryptString(input: string): string {
    let encrypted = '';
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      encrypted += charCode.toString() + ' ';
    }
    return encrypted.trim();
  }

  private decryptString(encrypted: string): string {
    const charCodes = encrypted.split(' ');
    let decrypted = '';
    for (const code of charCodes) {
      const char = String.fromCharCode(parseInt(code, 10));
      decrypted += char;
    }
    return decrypted;
  }

  private checkInitialLoginState(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('layout_tab');
      if (userData) {
        const data = JSON.parse(this.decryptString(userData));

        this.http.post(`${this.authURL}/login`, {email: data.email, password: data.password}, {headers : this.headers}).subscribe({
          next: (response) => {
            this.loggedIn.next(true);
          },
          error: (error) => {
            this.loggedIn.next(false);
            localStorage.removeItem('layout_tab');
          }
        });
        return true;
      }
    }
    return false;
  }

  login(userData: IUser): void {
    const encryptedUserData = this.encryptString(JSON.stringify(userData));
    if (isPlatformBrowser(this.platformId)){
      localStorage.setItem('layout_tab', encryptedUserData);
    }
    this.loggedIn.next(true);
  }

  // logout(): void {
  //   if (isPlatformBrowser(this.platformId)){
  //     localStorage.removeItem('layout_tab');
  //   }
  //   this.loggedIn.next(false);

  //   // location.href = "/";
  //   this.navigationSrv.navigate('/');
  //   // this.router.navigate(['home']);
  // } 

  logout(): void {
    try {
      if (isPlatformBrowser(this.platformId)){
        localStorage.removeItem('layout_tab');
      }
    } catch (e) {
      console.error('Error al acceder a localStorage', e);
    }
    this.loggedIn.next(false);
    window.location.assign('/');
  }
  

  // logout(): void {
  //   try {
  //     if (isPlatformBrowser(this.platformId)){
  //       localStorage.removeItem('layout_tab');
  //     }
  //   } catch (e) {
  //     console.error('Error al acceder a localStorage', e);
  //   }
  //   this.loggedIn.next(false);
  //   location.href = "/";
  // }

  retrieveUserData(): IUser | null {
    if (isPlatformBrowser(this.platformId)) {
      const encryptedUserData = localStorage.getItem('layout_tab');
      if (encryptedUserData) {
        const decryptedUserData = this.decryptString(encryptedUserData);
        return JSON.parse(decryptedUserData);
      }
    }
    return null;
  }

  isAuth(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const encryptedUserData = localStorage.getItem('layout_tab');
      if (encryptedUserData) {
        const decryptedUserData = this.decryptString(encryptedUserData);
        return JSON.parse(decryptedUserData);
      }
    }
    return false;
  }

  // login(credentials: { email: string; password: string }): void {
  //   const encryptedCredentials = this.encryptString(JSON.stringify(credentials));
  //   if (isPlatformBrowser(this.platformId)){
  //     localStorage.setItem('encryptedCredentials', encryptedCredentials);
  //   }
  //   this.loggedIn.next(true);
  // }

  // logout(): void {
  //   if (isPlatformBrowser(this.platformId)){
  //     localStorage.removeItem('encryptedCredentials');
  //   }
  //   this.loggedIn.next(false);
  // }

  checkUserLoggedIn(): Observable<boolean> {
    const isLoggedIn = this.loggedIn.getValue();
    if (isLoggedIn) {
      return new Observable((observer) => observer.next(true));
    } else {
      const userData = localStorage.getItem('layout_tab');
      if (userData) {
        const data = JSON.parse(this.decryptString(userData));
        return new Observable((observer) => {

          this.http.post(`${this.authURL}/login`, {email: data.email, password: data.password}, {headers : this.headers}).subscribe({
            next: (response) => {
              this.loggedIn.next(true);
              observer.next(true);
            },
            error: (error) => {
              observer.next(false);
            }
          });
        });
      } else {
        return new Observable((observer) => observer.next(false));
      }
    }
  }

  updateUserAddress(userId: string, updateAddress: IAddress): Observable<IUser>{
    return this.http.put<IUser>(`${this.authURL}/update-user-address/${userId}`, updateAddress, {headers: this.headers});
  }
}