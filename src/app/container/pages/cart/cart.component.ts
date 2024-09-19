import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICartItem } from '../../interfaces/cardItem.interface';
import { ToastService } from '../../../core/services/toast.service';
import { CartService } from '../../../core/services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  serverUrl = `${environment.serverUrl}/images`;
  @ViewChild('tooltip') tooltip!: ElementRef;
  @ViewChild('articles') articles!: ElementRef;

  private listener!: () => void;

  modalLoading = signal(false);
  showDeleteConfirmation = signal(false);
  userData!: IUser | null;
  isEskeleton = signal(true);

  itemsCard!: ICartItem[];
  totalItemsCardQuanty = signal(0);
  totalItemsCardPrice = signal(0);

  tooltipIndex: number | null = null;
  articlesContainerWidth: number = 0;
  articlesContainerHeight: number = 0;
  baseFontSize: number = 16;

  prueba = false;

  fakeItems: {}[] = [{}, {}];

  totalPrices = signal<{
    totalOriginalPrice: number;
    totalOfferPrice: number;
    totalSavings: number;
    totalSavingsPercentage: number;
  }>({
    totalOriginalPrice: 0,
    totalOfferPrice: 0,
    totalSavings: 0,
    totalSavingsPercentage: 0,
  });

  delivery = signal<{
    deliveryType: string;
    deliveryPrice: number;
    fisrtDate: string;
    secondDate: string;
  }>({
    deliveryType: 'Standard',
    deliveryPrice: 0,
    fisrtDate: '',
    secondDate: '',
  });

  private authSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private authSrv: AuthService,
    private toastSrv: ToastService,
    private cartSrv: CartService,
    private router: Router,
    private modalSrv: ModalService,
    private navigationService: NavigationService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      this.calculateShippingDates('Standard', 4, 10);

      this.baseFontSize = parseInt(
        getComputedStyle(document.documentElement).fontSize,
      );

      this.authSubscription = this.authSrv.isLoggedIn.subscribe((loggedIn) => {
        this.userData = this.authSrv.retrieveUserData();
        if (this.userData) {
          this.cartSubscription = this.cartSrv
            .getCartStatus()
            .subscribe((items: ICartItem[]) => {
              if (!items || !items.length) {
                this.itemsCard = [];
              }else{
                // this.itemsCard = [];
                this.setCartData(items);
              }
              setTimeout(() => {
                this.isEskeleton.set(false);
              }, 500);
            });
        } else {
          this.authSrv.logout();
        }
      });
    }
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.carculateArticlesWidth();
  
        this.listener = this.renderer.listen(
          'document',
          'click',
          (event: Event) => {
            this.carculateArticlesWidth();
  
            const clickTarget = event.target as HTMLElement;
            // Verifica si el clic fue fuera del tooltip
            if (!this.tooltip.nativeElement.contains(clickTarget)) {
              this.closeTooltip();
            }
          },
        );
      }
    });
  }

  carculateArticlesWidth() {
    const threeRemInPx = 2.5 * this.baseFontSize;
    if (this.articles.nativeElement?.offsetWidth) {
      this.articlesContainerWidth =
        this.articles.nativeElement.offsetWidth / 2 - threeRemInPx;
    } else {
      this.articlesContainerWidth = 0;
    }

    if (this.articles.nativeElement?.offsetHeight) {
      this.articlesContainerHeight =
        this.articles.nativeElement.offsetHeight / 2 - threeRemInPx;
    }
  }

  setCartData(items: ICartItem[]) {
    this.totalItemsCardQuanty.set(this.getTotalQuantity(items));
    this.totalItemsCardPrice.set(this.getTotalPrice(items));
    this.totalPrices.set(this.calculateTotalPrices(items));

    this.itemsCard = items;
    this.cartSrv.saveLocalItems(items);
  }

  // goToOtherPage(page: string) {
  //   if(this.modalLoading()) return;

  //   this.navigationService.navigate(
  //     `/${page}`,
  //   );
  // }

  goToOtherPage(page: string) {
    if (this.modalLoading()) return;
    this.router.navigate([page]);
  }

  goToDetailPage(item: ICartItem) {
    if (this.modalLoading()) return;
    this.navigationService.navigate(
      `/detail/${item.product.identifier}?colorid=${item.product.color?.id}`,
    );
  }

  toggleDeleteConfirmation(item: any) {
    this.showDeleteConfirmation.set(!this.showDeleteConfirmation());
    // this.showDeleteConfirmation = !this.showDeleteConfirmation;
    // ...código para manejar la eliminación...
  }

  deleteItemCart(item: ICartItem) {
    this.showDeleteConfirmation.set(true);
  }

  getTotalQuantity(items: ICartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(items: ICartItem[]): number {
    return items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  itemQuantyChange(item: ICartItem, quantity: string) {
    if (!this.userData) return;

    this.modalLoading.set(true);
    item.quantity = parseInt(quantity);
    this.cartSrv.updateItem(this.userData._id, item).subscribe(
      (items: ICartItem[]) => {
        // this.setCartData(items);

        this.cartSrv.notifyCart(items);
        this.modalLoading.set(false);
      },
      (err) => {
        const { statusCode, message } = err.error;
        this.toastSrv.showToast(
          'Ups! no se pudo actualizar el carrito!',
          'red-500',
        );

        this.modalLoading.set(false);
      },
    );
  }

  calculateSavings(originalPrice: number, priceOffer: number): number {
    if (originalPrice <= 0 || priceOffer <= 0) {
      return 0;
    }

    const ahorro = originalPrice - priceOffer;
    const porcentajeAhorro = (ahorro / originalPrice) * 100;
    return Math.floor(porcentajeAhorro);
  }

  calculateTotalPrices(cartItems: ICartItem[]): {
    totalOriginalPrice: number;
    totalOfferPrice: number;
    totalSavings: number;
    totalSavingsPercentage: number;
  } {
    let totalOriginalPrice = 0;
    let totalOfferPrice = 0;

    // Recorre cada elemento del carrito
    for (const item of cartItems) {
      totalOriginalPrice += item.product.originalPrice * item.quantity;
      totalOfferPrice += item.product.price * item.quantity;
    }

    // Calcula el ahorro total y el porcentaje de ahorro
    const totalSavings = totalOriginalPrice - totalOfferPrice;
    const totalSavingsPercentage = (totalSavings / totalOriginalPrice) * 100;

    return {
      totalOriginalPrice,
      totalOfferPrice,
      totalSavings,
      totalSavingsPercentage: Math.floor(totalSavingsPercentage),
    };
  }

  calculateShippingDates(
    deliveryType: string,
    diasLaborablesInicio: number,
    diasLaborablesFin: number,
  ): void {
    // Fecha actual
    const currentDate = new Date();

    // Calcular las fechas estimadas de inicio y fin
    const dateEstimatedInit = this.addBusinessDays(
      new Date(currentDate),
      diasLaborablesInicio,
    );
    const dateEstimatedEnd = this.addBusinessDays(
      new Date(currentDate),
      diasLaborablesFin,
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

    this.delivery.set({
      deliveryType: deliveryType,
      deliveryPrice: deliveryType === 'Standard' ? 0 : 200,
      fisrtDate: dateInitFormatted,
      secondDate: dateEndFormatted,
    });
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

  toggleTooltip(index: number) {
    if (this.tooltipIndex === index) {
      this.tooltipIndex = null;
    } else {
      this.tooltipIndex = index;
      this.showDeleteConfirmation.set(true);
    }
  }

  confirmDelete(item: ICartItem) {
    try {
      if (!this.userData) return;

      let updateUI = false;
      const remainingItems = this.cartSrv.deleteLocalItemFromCart(item);

      if (remainingItems) {
        updateUI = true;
        this.setCartData(remainingItems);
      }

      this.modalLoading.set(true);
      // hacer la request al servidor
      this.cartSrv
        .deleteItem(this.userData._id, item.product.identifier)
        .subscribe(
          (items: ICartItem[]) => {
            if (!updateUI) {
              this.setCartData(items);
            }
            this.modalLoading.set(false);
          },
          (err) => {
            const { statusCode, message } = err.error;
            this.modalLoading.set(false);
          },
        );
    } catch (error) {}
  }

  closeTooltip() {
    this.showDeleteConfirmation.set(false);
    this.tooltipIndex = null;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
