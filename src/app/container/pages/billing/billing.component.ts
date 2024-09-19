import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../core/interfaces/user.interface';
import { ICartItem } from '../../interfaces/cardItem.interface';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaymentValidator } from './payment.validator';
import { BillingService } from './billing.service';
import { ICard } from './card.interface';
import { OrderService } from '../../../core/services/order.service';
import { IOrder } from '../../../core/interfaces/order.interface';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent implements OnInit, OnDestroy {
  @ViewChild('inputExp') inputExp!: ElementRef;
  @ViewChild('inputCvv') inputCvv!: ElementRef;
  
  modalLoading   = signal(false);
  paymentLoading = signal(false);
  paymentError   = signal(false);
  isEskeleton    = signal(true);
  userData!: IUser | null;

  itemsCard!: ICartItem[];
  totalItemsCardQuanty = signal(0);
  totalItemsCardPrice = signal(0);

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

  countries: {
    name: string;
    code: string;
    areaCode: string;
  }[] = [
    { name: 'Antigua y Barbuda', code: 'AG', areaCode: '+1' },
    { name: 'Argentina', code: 'AR', areaCode: '+54' },
    { name: 'Bahamas', code: 'BS', areaCode: '+1' },
    { name: 'Barbados', code: 'BB', areaCode: '+1' },
    { name: 'Belice', code: 'BZ', areaCode: '+501' },
    { name: 'Bolivia', code: 'BO', areaCode: '+591' },
    { name: 'Brasil', code: 'BR', areaCode: '+55' },
    { name: 'Canadá', code: 'CA', areaCode: '+1' },
    { name: 'Chile', code: 'CL', areaCode: '+56' },
    { name: 'Colombia', code: 'CO', areaCode: '+57' },
    { name: 'Costa Rica', code: 'CR', areaCode: '+506' },
    { name: 'Cuba', code: 'CU', areaCode: '+53' },
    { name: 'Dominica', code: 'DM', areaCode: '+1' },
    { name: 'Ecuador', code: 'EC', areaCode: '+593' },
    { name: 'El Salvador', code: 'SV', areaCode: '+503' },
    { name: 'Estados Unidos', code: 'US', areaCode: '+1' },
    { name: 'Granada', code: 'GD', areaCode: '+1' },
    { name: 'Guatemala', code: 'GT', areaCode: '+502' },
    { name: 'Guyana', code: 'GY', areaCode: '+592' },
    { name: 'Haití', code: 'HT', areaCode: '+509' },
    { name: 'Honduras', code: 'HN', areaCode: '+504' },
    { name: 'Jamaica', code: 'JM', areaCode: '+1' },
    { name: 'México', code: 'MX', areaCode: '+52' },
    { name: 'Nicaragua', code: 'NI', areaCode: '+505' },
    { name: 'Panamá', code: 'PA', areaCode: '+507' },
    { name: 'Paraguay', code: 'PY', areaCode: '+595' },
    { name: 'Perú', code: 'PE', areaCode: '+51' },
    { name: 'República Dominicana', code: 'DO', areaCode: '+1' },
    { name: 'San Cristóbal y Nieves', code: 'KN', areaCode: '+1' },
    { name: 'San Vicente y las Granadinas', code: 'VC', areaCode: '+1' },
    { name: 'Santa Lucía', code: 'LC', areaCode: '+1' },
    { name: 'Surinam', code: 'SR', areaCode: '+597' },
    { name: 'Trinidad y Tobago', code: 'TT', areaCode: '+1' },
    { name: 'Uruguay', code: 'UY', areaCode: '+598' },
    { name: 'Venezuela', code: 'VE', areaCode: '+58' },
  ];

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

  paymentForm!: FormGroup;
  submitted = signal<boolean>(false);

  paymentValidator!: PaymentValidator;

  isEditingCard = signal<boolean>(false);
  linkCardError = signal<boolean>(false);
  currentCardAdded = signal<ICard | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authSrv: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cartSrv: CartService,
    private toastSrv: ToastService,
    private modalSrv: ModalService,
    private orderSrv: OrderService,
    private billingSrv: BillingService
  ) {
    this.paymentForm = this.fb.group({
      newNumbk: ['', [Validators.required]],
      newExk: ['', [Validators.required]],
      newCvk: ['', [Validators.required]],
    })

    this.paymentValidator = new PaymentValidator(this.paymentForm);
   
    // Ahora que paymentValidator está inicializado, puedes asignar los validadores
    this.paymentForm.get('newNumbk')?.setValidators([
      Validators.required,
      this.paymentValidator.cardValidator.bind(this.paymentValidator),
    ]);
    this.paymentForm.get('newExk')?.setValidators([
      Validators.required,
      this.paymentValidator.expirationValidator.bind(this.paymentValidator),
    ]);
    this.paymentForm.get('newCvk')?.setValidators([
      Validators.required,
      this.paymentValidator.cvvValidator.bind(this.paymentValidator),
    ]);

    // No olvides llamar a updateValueAndValidity si es necesario
    this.paymentForm.get('newNumbk')?.updateValueAndValidity();
    this.paymentForm.get('newExk')?.updateValueAndValidity();
    this.paymentForm.get('newCvk')?.updateValueAndValidity();
  }

  get paymentFormCtrl() {
    return this.paymentForm.controls;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });

      this.calculateShippingDates('Standard', 4, 10);

      this.authSrv.isLoggedIn.subscribe((loggedIn) => {
        if (loggedIn) {
          this.userData = this.authSrv.retrieveUserData();

          if (this.userData) {
            this.getLastCard(this.userData);

            if (
              !this.userData.country.code ||
              !this.userData.state.code ||
              !this.userData.city ||
              !this.userData.zipCode ||
              !this.userData.address
            ) {
              this.modalSrv.showAddressModal(this.userData);
              return;
            }
          } else {
            this.authSrv.logout();
          }
        } else {
          this.userData = null;
          this.authSrv.logout();
        }
      });
    }

    this.cartSrv.getCartStatus().subscribe((items: ICartItem[]) => {
      if (!items || !items.length) {
        this.itemsCard = [];
        return;
      }
      setTimeout(() => {
        this.setCartData(items);
      }, 500);
    });

    this.paymentForm.get('newNumbk')?.valueChanges.subscribe((value) => {
      this.paymentForm.patchValue(
        {
          cardNumber: this.paymentValidator.formatCardNumber(value),
        },
        { emitEvent: false },
      ); // Evita que se dispare un nuevo evento de cambio
    });

    this.paymentForm.get('newExk')?.valueChanges.subscribe((value) => {
      this.paymentForm.patchValue(
        {
          expirationDate: this.paymentValidator.formatExpirationDate(value),
        },
        { emitEvent: false },
      ); // Evita que se dispare un nuevo evento de cambio
    });
  }

  getLastCard(userData: IUser): void {
    console.log(userData);
  }

  getAllCards(userData: IUser): void {
    console.log(userData);
  }

  addCardSubmit() {
    if(this.modalLoading() || this.paymentLoading()){
      return;
    }

    this.submitted.set(true);

    if (this.paymentForm.valid) {
      this.modalLoading.set(true);
      this.linkCardError.set(false);

      if(this.userData){
        const cardDetails: ICard = {
          cardNumber: this.paymentForm.value.newNumbk,
          expirationDate: this.paymentForm.value.newExk,
          cardCVV: this.paymentForm.value.newCvk
        };

        console.log(cardDetails);

      }else{
        this.authSrv.logout();
      }
      
    }
  }

  deleteCard(){
    if(this.modalLoading() || this.paymentLoading()){
      return;
    }

    if(this.userData){
      this.modalLoading.set(true);

      const cardUpdate : { entryDate: Date; propertyName: string; propertyValue: boolean } = {
        entryDate: new Date(this.currentCardAdded()?.entryDate || ''),
        propertyName: 'deleted',
        propertyValue: true
      };

      console.log(cardUpdate);
    }else{
      this.authSrv.logout();
    }
  }

  modifyCard(){
    if(this.modalLoading() || this.paymentLoading()){
      return;
    }

    this.paymentForm.controls['newNumbk'].setValue(this.currentCardAdded()?.cardNumber);
    this.paymentForm.controls['newExk'].setValue(this.currentCardAdded()?.expirationDate);
    this.paymentForm.controls['newCvk'].setValue(this.currentCardAdded()?.cardCVV);

    this.currentCardAdded.set(null);
  }

  modifyDireccion() {
    if(this.modalLoading() || this.paymentLoading()){
      return;
    }
    this.modalSrv.showAddressModal(this.userData);
  }

  setCartData(items: ICartItem[]) {
    if(!items || !items.length  ){
      this.router.navigateByUrl('/');
      return;
    }
    this.totalItemsCardQuanty.set(this.getTotalQuantity(items));
    this.totalItemsCardPrice.set(this.getTotalPrice(items));
    this.totalPrices.set(this.calculateTotalPrices(items));

    this.itemsCard = items;
    this.cartSrv.saveLocalItems(items);
  }

  finishOrder() {
    if(this.modalLoading() || this.paymentLoading()){
      return;
    }

    if(this.userData && this.currentCardAdded()){
      this.paymentLoading.set(true);

      const cardUpdate  = {
        entryDate: new Date(this.currentCardAdded()?.entryDate || '')
      };

      console.log(cardUpdate);
    }else{
      this.authSrv.logout();
    }
  }

  saveOrder(): void{
    try {
      this.cartSrv.deleteAllItemsFromCart(this.userData?._id || '').subscribe({
        next: () => {

          this.cartSrv.deleteLocalItems();
          // this.currentCardAdded.
          const newOrder: IOrder = {
            userId: this.userData?._id || '',
            orderId: this.generarIdAleatorio(),
            fullName: this.userData?.fullName ? this.userData?.fullName : this.userData?.name + " " + this.userData?.lastName,
            cardType: this.verifyIfVisaCard(this.currentCardAdded()?.cardNumber),
            lastNumberCard: this.currentCardAdded()?.cardNumber.replace(/\s/g, '').slice(-4) || '',
            address: this.userData?.address,
            totalOriginalPrices: this.totalPrices().totalOriginalPrice,
            totalOfferPrices: this.totalPrices().totalOfferPrice,
            totalProducts: this.totalItemsCardQuanty(),
            delivery: this.delivery().deliveryType,
            country: this.userData?.country,
            state: this.userData?.state,
            city: this.userData?.city,
            zipCode: this.userData?.zipCode,
            cart: this.itemsCard,
          }

          // console.log("newOrder => ", newOrder);
          
          this.orderSrv.createOrder(newOrder).subscribe({
            next: (order: IOrder) => {
              setTimeout(() => {
                this.router.navigate([`/order/completed/${order._id}`])
              }, 1000);
            },
            error: (err) => {
              console.error(err);
              setTimeout(() => {
                this.paymentLoading.set(false);
              }, 2000);
            }
          });
        },
        error: (err) => {
          console.error('Error al eliminar elementos del carrito:', err);
          setTimeout(() => {
            this.paymentLoading.set(false);
          }, 2000);
        }
      });
    } catch (error) {
      console.log("ERROR EN saveOrder()");
    }
  }

  goToOtherPage(page: string) {
    if(this.modalLoading() || this.paymentLoading()){
      return;
    }
    this.router.navigate([page]);
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
    //: (totalOfferPrice + this.delivery().deliveryPrice)
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

  findAreaCodeByCountryCode(countryCode: string): string | undefined {
    return this.countries.find((country) => country.code === countryCode)
      ?.areaCode;
  }

  verifyIfVisaCard(currentCard: string | null = null): string {
    if(currentCard){
      if (currentCard.startsWith('4')) {
        return 'Visa';
      } else if (currentCard.startsWith('5')) {
        return 'Mastercard';
      } else if (currentCard.startsWith('3')) {
        return 'American Express';
      } else {
        return 'Desconocida';
      }
    }else if(this.paymentForm.get('newNumbk')?.value && this.paymentForm.get('newNumbk')?.value.length >= 4){
      const number = this.paymentForm.get('newNumbk')?.value;
      if (number.startsWith('4')) {
        return 'Visa';
      } else if (number.startsWith('5')) {
        return 'Mastercard';
      } else if (number.startsWith('3')) {
        return 'American Express';
      } else {
        return 'Desconocida';
      }
    }

    return '';
  }

  handleCardNumberInput(event: KeyboardEvent) {
    if(event){
      const input = event.target as HTMLInputElement;
      if (input.value && input.value.replace(/\D/g, '').length === 16) {
        this.inputExp.nativeElement.focus();
      }
    }
  }

  handleExpirationInput(event: KeyboardEvent) {
    if(event){
      const input = event.target as HTMLInputElement;
      if (input.value && input.value.replace(/\D/g, '').length === 4) {
        this.inputCvv.nativeElement.focus();
      }
    }
  }

  analyzeCardDetails(cardDetails: ICard | null) : {type: string, cardEnd: string} {
    if(!cardDetails){
      return { cardEnd: '', type: '' };
    }

    // Elimina espacios para la validación
    const sanitizedCard = cardDetails.cardNumber.replace(/\s/g, '');

    // Extraer los últimos 4 dígitos del número de tarjeta
    const cardEnd = sanitizedCard.slice(-4);

    let type = "Tarjeta";
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^(?:5[1-5][0-9]{14})$/;
  
    if (visaRegex.test(sanitizedCard)) {
      type = 'Visa';
    } else if (mastercardRegex.test(sanitizedCard)) {
      type = 'Mastercard';
    } else {
      type = 'Tarjeta';
    }
  
    return { cardEnd, type };
  }
  
   generarIdAleatorio(): string {
    const longitud = 7; // Longitud deseada para el ID (puedes ajustarla)
    const caracteres = '0123456789'; // Caracteres permitidos para el ID
  
    let id = '#';
    for (let i = 0; i < longitud; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      id += caracteres.charAt(indiceAleatorio);
    }
  
    return id;
  }
  
  
  ngOnDestroy(): void {
    this.paymentForm.reset();
  }
}
