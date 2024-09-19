import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CouponsComponent } from "./components/coupons.component";
import { FavoritesComponent } from "./components/favorites.component";
import { NotificationsComponent } from "./components/notifications.component";
import { AddressComponent } from "./components/address.component";
import { OrdersComponent } from "./components/orders.component";

@Component({
    selector: 'app-account',
    standalone: true,
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss',
    imports: [CommonModule, CouponsComponent, FavoritesComponent, NotificationsComponent, AddressComponent, OrdersComponent]
})
export class AccountComponent implements OnInit {

  @Input() option!: string;

  activeOption = signal<string>('orders');
  sidebarOpen = signal<boolean>(true);

  ngOnInit(): void {
    if(this.option && this.option.length){
      this.activeOption.set(this.option);
    }
  }

  setActiveOption(option: string){
    this.activeOption.set(option);
    this.toggleSidebar(); // Oculta el sidebar al seleccionar una opción
  }

  toggleSidebar(): void {
    // this.sidebarOpen.set(!this.sidebarOpen());
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  capitalizeFirstLetter(text: string): string {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
  }
}
