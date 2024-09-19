import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<{ show: boolean; message: string; color: string }>({
    show: false,
    message: '',
    color: '',
  });

  showToast(message: string, color: string) {
    this.toastSubject.next({ show: true, message, color });
  }

  hideToast() {
    this.toastSubject.next({ show: false, message: '', color: '' });
  }

  getToastStatus() {
    return this.toastSubject.asObservable();
  }
}