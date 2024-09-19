// header-visibility.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderVisibilityService {
  private _isVisible = new BehaviorSubject<{visible: boolean, scrollUp: boolean, currentScroll: number}>({visible: true, scrollUp:false, currentScroll: 0});
  public isVisible = this._isVisible.asObservable();

  constructor() {}

  showHeader(scrollUp: boolean, currentScroll: number) {
    this._isVisible.next({visible: true, scrollUp, currentScroll});
  }

  hideHeader(scrollUp: boolean, currentScroll: number) {
    this._isVisible.next({visible: false, scrollUp, currentScroll});
  }
}