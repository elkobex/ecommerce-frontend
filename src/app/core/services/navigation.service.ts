import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomReuseStrategy } from '../class/customReuseStrategy';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {
    this.router.routeReuseStrategy = new CustomReuseStrategy();
    this.router.onSameUrlNavigation = 'reload';
  }

  // Método para navegar
  public navigate(url: string): void {
    this.router.navigateByUrl(url);
  }
}
