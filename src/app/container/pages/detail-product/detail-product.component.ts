import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, state, style, animate, transition, group, query } from '@angular/animations';
import { IColor, IProduct } from '../../interfaces/product.interface';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../products/products.service';
import { IColorModel } from '../../interfaces/color-model.interface';
import { RelatedComponent } from "../../components/detail/related.component";
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { ICartItem } from '../../interfaces/cardItem.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';

// Importar Swiper y los estilos necesarios
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


@Component({
    selector: 'app-detail-product',
    standalone: true,
    templateUrl: './detail-product.component.html',
    styleUrl: './detail-product.component.scss',
    animations: [
        trigger('slideAnimation', [
            // Estado 'next' para la siguiente imagen
            state('next', style({ transform: 'translateX(0)' })),
            // Estado 'prev' para la imagen anterior
            state('prev', style({ transform: 'translateX(0)' })),
            // Transición de derecha a izquierda cuando la imagen siguiente entra
            transition('* => next', [
                style({ transform: 'translateX(100%)' }),
                animate('0.5s ease-out')
            ]),
            // Transición de izquierda a derecha cuando la imagen anterior entra
            transition('* => prev', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.5s ease-out')
            ])
        ])
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [CommonModule, RouterLink, FormsModule, RelatedComponent]
})
export class DetailProductComponent implements OnInit, OnDestroy {
  
  suscriptionModalState!: Subscription;
  showDetailModal: boolean = false;

  loading: boolean = false;
  errorUpdateProduct: boolean = false;
  productError: boolean = false;

  animationState: string = 'next';
  serverUrl = `${environment.serverUrl}/images`;
  
  PRODUCTS: IProduct[] = [];
  userData!: IUser | null;

  // testProduct 
  mainProduct: IProduct = {} as IProduct;
  currentProduct: IProduct = {} as IProduct;
  allProductModels: IColorModel[] = [] as IColorModel[];

  initialIdentifier: string = "";
  
  quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 

  currentColorLoading: string = '';
  currentImageIndex = 0;
  selectedColorIndex = 0;
  selectedSizeIndex = 0;
  selectedQuantity = 1;

  isEskeleton = signal(true);

  testProducts: any[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ];

  maxWidth!: string;

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private authSrv: AuthService,
    private cdr: ChangeDetectorRef, 
    private modalSrv: ModalService, 
    private route: ActivatedRoute, 
    private router: Router,
    private productSrv: ProductsService,
    private cd: ChangeDetectorRef,
    private cartSrv: CartService,
    private toastSrv: ToastService,
    private navigationService: NavigationService,
    private elRef: ElementRef
  ){}

  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      this.calculateShippingDates('Standard', 4, 10);
    }

    this.authSrv.isLoggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.userData = this.authSrv.retrieveUserData();
      } else {
        this.userData = null;
      }
    });

    // this.route.paramMap.subscribe(params => {
    //   const identifier = params.get('identifier');
    //   if(identifier){
    //     this.initialIdentifier = identifier;
    //     this.getProductByIdentifier(identifier, 'colorId');
    //   }
    // });

    // Para obtener el parámetro de ruta 'identifier'
    this.route.paramMap.subscribe(params => {
      const identifier = params.get('identifier');
      if (identifier) {
        this.initialIdentifier = identifier;
        // Suscríbete a queryParamMap para obtener colorId
        this.route.queryParamMap.subscribe(queryParamMap => {
          const colorId = queryParamMap.get('colorid');
          this.getProductByIdentifier(identifier, colorId);
        });
      }
    });

    // this.suscriptionModalState = this.modalSrv.getModalDetailStatus().subscribe((data) => {
    //   if(!data.status){
    //     // this.router.navigate(['/']);
    //   }else{
    //     console.log("MODAL DETAIL DATA => ", data);
    //   }
    // })
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.calculateWidth();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateWidth();
  }

  private calculateWidth() {
    const width = window.innerWidth;

    console.log("width => ", width);

    if (width < 768) {
      this.maxWidth = (width * 0.88) + 'px';
      console.log("maxWidth => ", this.maxWidth);
    } else {
      this.maxWidth = '';
    }
  }
  
  getProductByIdentifier(identifier: string, colorId: string | null): void {
    this.loading = true;
    this.productSrv.getProductByIdentifier(identifier).subscribe(
      (data: IProduct) => {
        this.allProductModels.push({
          identifier: data.identifier,
          name: data.name,
          color: data.color,
          referenceId: data.id,
          imageUrl: data.imageUrl,
          category: data.category,
          productUrl: data.productUrl,
          images: data.images,
        })
        
        this.getProductsByCategory(data.category);

        this.errorUpdateProduct = false;
        this.mainProduct = data;
        this.currentProduct = data;

        if(colorId && colorId.length){ 
          // this.setCurrentColor(colorId);
          this.selectColor(this.getIndexColor(colorId));
        }

        setTimeout(() => {
          this.isEskeleton.set(false);
        }, 50);
      },
      (error) => {
        this.errorUpdateProduct = true;
        this.loading = false;
        setTimeout(() => {
          this.isEskeleton.set(false);
        }, 50);
      }
    );
  }

  getProductsByCategory(category: string): void {
    this.loading = true;
    this.productSrv.getProductsByCategory(category).subscribe({
      next: (products: IProduct[]) => {
        this.PRODUCTS = products;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.PRODUCTS = [];
      }
    });
  }

  getFirstFiveColors(identifier: string) {
    return this.currentProduct.colors.slice(0, 5).map(color => ({
      id: color.id,
      imagen: color.imagen,
      title: color.title,
      loading: (color.id === identifier) ? true : false
    }));
  }

  showNextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProduct.images.length;
    this.animationState = 'next';
  }

  showPreviousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProduct.images.length) % this.currentProduct.images.length;
    this.animationState = 'prev';
  }

  selectColor(index: number): void {
    const prevSelecteColorIndex = this.selectedColorIndex;
    this.selectedColorIndex = index;

    let currentModel = this.currentProduct.colors[this.selectedColorIndex];

    this.loading = true;
    this.currentColorLoading = currentModel.id;

    const model = this.findModelByIdentifier(currentModel.id);
    if(model){
      this.currentProduct.images = model.images;
      this.currentProduct.name = model.name;
      // this.currentProduct.identifier = model.identifier;
      this.loading = false;
      this.currentImageIndex = 0;
      this.currentColorLoading = '';

      this.setCurrentColor(model.identifier);
    }else{
      this.productSrv.getModelByIdentifier(currentModel.id).subscribe(
        (model: IColorModel) => {
          this.allProductModels.push(model);
          this.errorUpdateProduct = false;
          this.currentProduct.images = model.images;
          this.currentProduct.name = model.name;
          // this.currentProduct.identifier = model.identifier;

          this.loading = false;
          this.currentColorLoading = '';
          this.currentImageIndex = 0;
          this.setCurrentColor(model.identifier);
        },
        (error) => {
          this.loading = false;
          this.currentColorLoading = '';
          this.selectedColorIndex = prevSelecteColorIndex;
          this.errorUpdateProduct = true;
        }
      );
    }
  }

  findModelByIdentifier(identifier: string): IColorModel | undefined {
    return this.allProductModels.find(model => model.identifier === identifier);
  }  

  selectSize(index: number): void {
    this.selectedSizeIndex = index;
    this.currentProduct.size = this.currentProduct.sizes[index];
  }

  calculateSavings(originalPrice: number, priceOffer: number): number {
    if (originalPrice <= 0 || priceOffer <= 0) {
      return 0;
    }
  
    const ahorro = originalPrice - priceOffer;
    const porcentajeAhorro = (ahorro / originalPrice) * 100;
    return Math.floor(porcentajeAhorro);
  }

  addToCard(product: IProduct, detail: boolean) {
    try {
      if (!this.userData) {
        this.modalSrv.showModal();
        return;
      }

      product.loading = true;

      const cardItem: ICartItem = {
        quantity: +this.selectedQuantity,
        product: {
          id: product.id,
          identifier: product.identifier,
          name: product.name,
          imageUrl: product.imageUrl || 'placeholder.jpg',
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          sizes: product.sizes,
          size: this.currentProduct.size || null,
          // color: product.colors ? product.colors[0] : null,
          // color: this.currentProduct.colors[0],
          color: detail ? this.getCurrentColor() : product.colors[0],
        },
      };

      let updateUI = false;

      const updateCartItems = this.cartSrv.addLocalItemToCart(cardItem);
      if (updateCartItems) {
        updateUI = true;
        this.cartSrv.notifyCart(updateCartItems);
      }

      this.cartSrv.addItem(this.userData._id, cardItem).subscribe(
        (items: ICartItem[]) => {
          if (!updateUI) {
            this.cartSrv.notifyCart(items);
          }
          this.cartSrv.addItemToCart(cardItem);

          product.loading = false;
        },
        (err) => {
          const { statusCode, message } = err.error;
          this.toastSrv.showToast(
            '¡Ups! No se pudo agregar el artículo al carrito',
            'red-500',
          );
          product.loading = false;
        },
      );
    } catch (error) {
      product.loading = false;
      this.toastSrv.showToast(
        '¡Ups! No se pudo agregar el artículo al carrito',
        'red-500',
      );
    } finally {
      this.selectedColorIndex = 0;
      this.selectedQuantity = 1;
    }
  }

  setCurrentColor(colorId: string): void {
    // this.currentProduct.colors.forEach((color: IColor) => {
    //   if (color.id === colorId) {
    //     color.selected = true;
    //   } else {
    //     color.selected = false;
    //   }
    // });

    this.currentProduct.colors.forEach((color: IColor, index: number) => {
      if (color.id === colorId) {
        color.selected = true;
        this.selectedColorIndex = index;
      } else {
        color.selected = false;
      }
    });
  }

  goToDetailPage(item: ICartItem) {
    this.navigationService.navigate(
      `/detail/${item.product.identifier}?colorid=${item.product.color?.id}`,
    );
  }

  getIndexColor(colorId: string) {
    return this.currentProduct.colors.findIndex((color: IColor) => color.id === colorId);
  }

  getCurrentColor(): IColor | undefined {
    return this.currentProduct.colors.find(color => color.selected);
  }

  loadMore(){
    this.router.navigate(['/products'], { queryParams: {} });
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

  ngOnDestroy(){
    if(this.suscriptionModalState){
      this.suscriptionModalState.unsubscribe();
    }
  }
}