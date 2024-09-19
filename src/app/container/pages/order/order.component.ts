import {
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { IUser } from '../../../core/interfaces/user.interface';
import { ICartItem } from '../../interfaces/cardItem.interface';
import { OrderService } from '../../../core/services/order.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from '../../../core/interfaces/order.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit, OnDestroy {
  serverUrl = `${environment.serverUrl}/images`;

  userData!: IUser | null;
  isEskeleton = signal(true);
  itemsCard!: ICartItem[];

  currentOrder = signal<IOrder | null>(null);

  currenPricing = signal<{
    totalOriginalPrices: number;
    totalOffersPrices: number;
    totalDiscont: number;
    shippingPrice: number;
    totalPrice: number;
  }>({
    totalOriginalPrices: 0,
    totalOffersPrices: 0,
    totalDiscont: 0,
    shippingPrice: 0,
    totalPrice: 0,
  });

  fakeItems: {}[] = [{}, {}];

  currentType: string = 'completed';

  // SUBSCRIPTIONS
  private cartSubscription!: Subscription;

  // SERVICES
  private authSrv = inject(AuthService);
  private cartSrv = inject(CartService);
  private orderSrv = inject(OrderService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.history.pushState(null, 'null', window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, 'null', window.location.href);
      };

      window.addEventListener('popstate', () => {
        this.redirectToHome();
      });

      this.route.paramMap.subscribe((params) => {
        this.loadOrder(params.get('type'), params.get('identifier'));
      });
    }
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/');
  }

  loadOrder(type: string | null, identifier: string | null): void {
    if (!type || !identifier) {
      this.router.navigate(['/']);
      return;
    }

    this.currentType = type;

    this.orderSrv.getOrderById(identifier).subscribe({
      next: (order: IOrder) => {
        this.itemsCard = order.cart;
        this.currentOrder.set(order);

        this.currenPricing.set({
          totalOriginalPrices: order.totalOriginalPrices,
          totalOffersPrices: order.totalOfferPrices,
          totalDiscont: order.totalOriginalPrices - order.totalOfferPrices,
          shippingPrice: order.delivery === 'Standard' ? 0 : 200,
          totalPrice:
            order.totalOfferPrices + (order.delivery === 'Standard' ? 0 : 200),
        });

        setTimeout(() => {
          if(order.cart && order.cart.length){
            this.isEskeleton.set(false);
          }else{
            this.redirectToHome();
          }
        }, 500);
      },
      error: (err) => {
        console.error(err);
        // this.isEskeleton.set(false);
        this.redirectToHome();
      },
    });
  }

  // 'Mastercard' | 'Express'
  calculateEstimatedDeliveryDate(
    orderDate: Date | undefined,
    shippingType: string | undefined,
  ): { daysRemaining: number; estimatedDate: string } {
    if (!orderDate || !shippingType) {
      return {
        daysRemaining: -1000,
        estimatedDate: '',
      };
    }

    const orderDateObj = new Date(orderDate.toString());
    const currentDate = new Date();

    let firstDateDays: number;
    let secondDateDays: number;

    if (shippingType === 'Standard') {
      firstDateDays = 4;
      secondDateDays = 10;
    } else if (shippingType === 'Express') {
      firstDateDays = 2;
      secondDateDays = 5;
    } else {
      throw new Error('Unsupported shipping type.');
    }

    const daysElapsed = Math.ceil(
      (currentDate.getTime() - orderDateObj.getTime()) / (1000 * 3600 * 24),
    );

    const remainingDaysForSecondDate = secondDateDays - daysElapsed;

    orderDateObj.setDate(orderDateObj.getDate() + secondDateDays);
    const estimatedDate = orderDateObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      daysRemaining: remainingDaysForSecondDate,
      estimatedDate: estimatedDate.replace(/ /g, ', ').replace('.', ''),
    };
  }

  // Example usage:
  // const orderDate = '2024-06-06T16:20:09.261Z';
  // const shippingType = 'Mastercard'; // Change to 'Express' if needed

  // const { daysRemaining, estimatedDate } = calculateEstimatedDeliveryDate(orderDate, shippingType);
  // console.log(`Remaining days: ${daysRemaining}`);
  // console.log(`Estimated delivery date: ${estimatedDate}`);

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
