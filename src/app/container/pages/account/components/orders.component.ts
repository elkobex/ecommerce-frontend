import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { IUser } from '../../../../core/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { IOrder } from '../../../../core/interfaces/order.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  template: `
    <!-- items-center justify-center  -->
    <section id="orders" class="p-4">
      @for (order of orders(); track $index) {
        <!-- Pedido -->
        <div
          class="flex flex-col md:flex-row justify-between items-center mb-4"
        >
          <div class="flex flex-col mb-2 md:mb-0">
            <span class="font-semibold text-lg">{{ order.orderId }}</span>
            <span class="text-sm text-gray-600" 
              >Fecha de Entrega: {{ calculateShippingDates(order).secondDate }}</span
            >

            <div class="hidden md:block mt-4">
              <a
                (click)="goOrder(order)"
                class="cursor-pointer inline-block px-4 py-2 text-sm text-slate-700 border border-slate-700  bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                Ver pedido
              </a>
            </div>
          </div>

          <!-- Precios del pedido -->
          <div class="flex flex-col items-center text-slate-700">
            <span
              >SubTotal: {{ order.totalOriginalPrices | currency: 'MXN' }}</span
            >
            <span
              >Descuento:
              {{ getPricing(order).totalDiscont | currency: 'MXN' }}</span
            >
            <span
              >Envio:
              {{ getPricing(order).shippingPrice | currency: 'MXN' }}</span
            >
            <span
              >Precio total:
              {{ getPricing(order).totalPrice | currency: 'MXN' }}</span
            >

            <div class="md:hidden mt-4">
              <a
                (click)="goOrder(order)"
                class="cursor-pointer inline-block px-4 py-2 text-sm text-slate-700 border border-slate-700  bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                Ver pedido
              </a>
            </div>
          </div>
        </div>

        <!-- Detalles del pedido -->
        <!-- Aquí puedes insertar los detalles del pedido como imágenes o descripciones -->

        <div class="border-t-2 pt-4"></div>
      } @empty {
        <div
      class="flex flex-col items-center justify-center h-full p-5 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-28 w-28 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5.121 11.121a1.5 1.5 0 112.122-2.122 1.5 1.5 0 01-2.122 2.122zM11 12a2 2 0 100-4 2 2 0 000 4zm6.364-6.364a1.5 1.5 0 11-2.122 2.122 1.5 1.5 0 012.122-2.122z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.5a2 2 0 01-2.828 0l-4.243-4.243a2 2 0 112.828-2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414a2 2 0 112.828 2.828z"
        />
      </svg>
      <span class="text-lg text-gray-600 font-semibold"
        >Lista de Pedidos Vacía</span
      >
      <p class="text-gray-500">No tienes ninguna pedido pendiente.</p>
      <p class="text-sm text-gray-400 mt-2">¡Vuelve pronto! 😊</p>
    </div>
      }
    </section>
  `,
  styles: ``,
})
export class OrdersComponent implements OnInit, OnDestroy {
  serverUrl = `${environment.serverUrl}/images`;

  private authSrv = inject(AuthService);
  private orderSrv = inject(OrderService);
  private router = inject(Router);

  userData = signal<IUser | null>(null);
  orders = signal<IOrder[] | null>(null);
  private authSubscription!: Subscription;

  control: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userData.set(this.authSrv.retrieveUserData());

      this.authSubscription = this.authSrv.isLoggedIn.subscribe(
        (isLogged: boolean) => {
          if (isLogged) {
            this.userData.set(this.authSrv.retrieveUserData());

            if (this.control === 0) {
              this.loadOrder();
              this.control++;
            }
          } else {
            this.router.navigateByUrl('/');
          }
        },
      );
    }
  }

  loadOrder() {
    try {
      if (!this.userData() || !this.userData()?._id) {
        this.router.navigateByUrl('/');
        return;
      }

      this.orderSrv.getOrdersByUserId(this.userData()?._id || '').subscribe({
        next: (orders: IOrder[]) => {
          this.orders.set(orders);
        },
        error: (error: any) => {
          this.orders.set(null);
          console.log('Error => ', Error);
        },
      });
    } catch (error) {}
  }

  getPricing(order: IOrder): {
    totalOriginalPrices: number;
    totalOffersPrices: number;
    totalDiscont: number;
    shippingPrice: number;
    totalPrice: number;
  } {
    return {
      totalOriginalPrices: order.totalOriginalPrices,
      totalOffersPrices: order.totalOfferPrices,
      totalDiscont: order.totalOriginalPrices - order.totalOfferPrices,
      shippingPrice: order.delivery === 'Standard' ? 0 : 200,
      totalPrice:
        order.totalOfferPrices + (order.delivery === 'Standard' ? 0 : 200),
    };
  }

  goOrder(order: IOrder){
    console.log("ORDER => ", order);
    this.router.navigate(['order', 'viewer', order._id])
  }

  calculateShippingDates(order: IOrder): {fisrtDate: string; secondDate: string} {
    // Fecha actual
    const currentDate = new Date(order.orderDate || "");

    // Calcular las fechas estimadas de inicio y fin
    const dateEstimatedInit = this.addBusinessDays(
      new Date(currentDate), (order.delivery === 'Standard') ? 4 : 2
    );
    const dateEstimatedEnd = this.addBusinessDays(
      new Date(currentDate), (order.delivery === 'Standard') ? 10 : 5
    );

    // Formatear las fechas a un formato legible
    // const opcionesDeFormato = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const opcionesDeFormato: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const dateInitFormatted = dateEstimatedInit.toLocaleDateString(
      'es-ES',
      opcionesDeFormato,
    );
    const dateEndFormatted = dateEstimatedEnd.toLocaleDateString(
      'es-ES',
      opcionesDeFormato,
    );

    return {
      fisrtDate: dateInitFormatted,
      secondDate: dateEndFormatted,
    }
  }

  addBusinessDays(fechaInicial: Date, diasLaborables: number): Date {
    let diasRestantes = diasLaborables;
    while (diasRestantes > 0) {
      fechaInicial.setDate(fechaInicial.getDate() + 1);
      // Si no es sábado (6) ni domingo (0), disminuye los días restantes
      if (fechaInicial.getDay() !== 0 && fechaInicial.getDay() !== 6) {
        diasRestantes--;
      }
    }
    return fechaInicial;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
