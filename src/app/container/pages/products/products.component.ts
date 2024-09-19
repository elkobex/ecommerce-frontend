import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from './products.service';
import { IProduct } from '../../interfaces/product.interface';
import { environment } from '../../../../environments/environment';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { HeaderVisibilityService } from '../../../core/services/header-visible.service';
import { CeilPipe } from '../../../core/pipes/ceil.pipe';
import { ProductFilters } from './product.filter.interface';
import { FormsModule } from '@angular/forms';
import { ICartItem } from '../../interfaces/cardItem.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CeilPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('outContainer') outContainer!: ElementRef;
  @ViewChild('mainContainer') mainContainer!: ElementRef;
  @ViewChild('filterContainer') filterContainer!: ElementRef;
  @ViewChild('productsContainer') productsContainer!: ElementRef;
  @ViewChild('paginationContainer') paginationContainer!: ElementRef;

  @ViewChild('dropdowncolor') dropdowncolor!: ElementRef;
  @ViewChild('dropdowncategory') dropdowncategory!: ElementRef;

  isCollapsed: boolean = true;
  scrollUp: boolean = false;

  private observer!: IntersectionObserver | undefined;
  private footerIsVisible: boolean = false;

  products: IProduct[] = [];
  testProducts: any[] = [{id: 1},{id: 2},{id: 3},{id: 4},{id: 5},{id: 6},{id: 7},{id: 8},{id: 9},{id: 10},{id: 11},{id: 12},{id: 13},{id: 14},{id: 15},{id: 16},{id: 17},{id: 18},{id: 19},{id: 20}];

  loading: boolean = false;
  productError: boolean = false;
  // page: number = 1;

  userData!: IUser | null;

  serverUrl = `${environment.serverUrl}/images`;
  resizeSubscription!: Subscription;

  currentWidth: number = 0;

  currentTopScrollProductsContainer: number = 200;
  countForRow: number = 2;

  // PAGINACION
  private MAX_VISIBLE_PAGES: number = 10;

  productsContainerMinHeight: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;
  total: number = 0;
  totalPages: number = 0;

  pages: any[] = [];
  ellipsis: boolean = false;

  /* FILTROS */
  availableColors = [
    { "id": 1, "name": "Negros", "code": "#000000" },
    { "id": 2, "name": "Azul Marino", "code": "#000080" },
    { "id": 3, "name": "Verdes", "code": "#008000" },
    { "id": 4, "name": "Rojos", "code": "#FF0000" },
    { "id": 5, "name": "Azules", "code": "#0000FF" },
    { "id": 6, "name": "Rosas", "code": "#FFC0CB" },
    { "id": 7, "name": "Blancos", "code": "#FFFFFF" },
    { "id": 8, "name": "Naranjas", "code": "#FFA500" },
    { "id": 9, "name": "Marrom", "code": "#8B4513" },
    { "id": 10, "name": "Verde Menta", "code": "#98FF98" },
    { "id": 11, "name": "Verdes Claro", "code": "#90EE90" },
    { "id": 12, "name": "Azules Claro", "code": "#ADD8E6" },
    { "id": 13, "name": "Beige", "code": "#F5F5DC" },
    { "id": 14, "name": "Morados", "code": "#800080" },
    { "id": 15, "name": "Lavanda", "code": "#E6E6FA" },
    { "id": 16, "name": "Grises", "code": "#808080" },
    { "id": 17, "name": "Negros Camuflados", "code": "#464646" },
    { "id": 18, "name": "Grises Marrom", "code": "#736F6E" },
    { "id": 19, "name": "Amarillos", "code": "#FFFF00" },
    { "id": 20, "name": "Rojos Oscuro", "code": "#8B0000" },
    { "id": 21, "name": "Kaki", "code": "#F0E68C" },
    { "id": 22, "name": "Coral", "code": "#FF7F50" },
    { "id": 23, "name": "Verde Oliva Oscuro", "code": "#556B2F" },
    { "id": 24, "name": "Verde Oliva", "code": "#808000" },
    { "id": 25, "name": "Grises Negros", "code": "#A9A9A9" }
  ];
  selectedColor: string | null = null;

  selectedName: string | null = null;
  selectedCategory: string | null = null;
  categories: string[] = ['Polo', 'Gorras', 'Bragas', 'Playeras', 'Camisas', 'Sudaderas', 'Bermudas', 'Pantalones'];
  
  openDropDownColor: boolean = false;
  openDropDownCategory: boolean = false;

  // Define tus filtros aquí
  filters: ProductFilters  = {
    category: '',
    name: '',
    minPrice: undefined,
    maxPrice: undefined,
    color: '',
    size: '',
    page: 1,
    pageSize: (this.pageSize * this.countForRow)
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authSrv: AuthService,
    private route: ActivatedRoute,
    private modalSrv: ModalService,
    private cartSrv: CartService,
    private toastSrv: ToastService,
    private productsSrv: ProductsService,
    private renderer: Renderer2,
    private viewportScroller: ViewportScroller,
    private headerVisibilityService: HeaderVisibilityService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      this.currentWidth = window.innerWidth;
      this.setCountForRow(this.currentWidth);

      this.resizeSubscription = fromEvent(window, 'resize').subscribe(
        (event) => {
          this.currentWidth = window.innerWidth;
          this.setCountForRow(this.currentWidth);

          if (this.currentWidth > 1023) {
            const width =
              this.filterContainer.nativeElement.parentElement.offsetWidth;
            this.renderer.setStyle(
              this.filterContainer.nativeElement,
              'width',
              `${width}px`
            );
          }
        }
      );
    }

    this.authSrv.isLoggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.userData = this.authSrv.retrieveUserData();
      }else{
        this.userData = null;
      }
    });

    this.route.queryParams.subscribe((params) => {
      // Cambia la llamada a loadProducts por searchProducts con los parámetros adecuados
      const { category, name, minPrice, maxPrice, color } = params;

      this.selectedColor = color;
      this.selectedCategory = category;
      this.selectedName = name;

      this.filters.name = this.sanitizeAndCapitalize(name);
      this.filters.color = this.sanitizeAndUpperCase(color);
      this.filters.category = this.sanitizeAndCapitalize(category);
      // this.filters.minPrice = minPrice;
      // this.filters.maxPrice = maxPrice;
       
      this.searchProducts();
    });
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (isPlatformBrowser(this.platformId)) {
        const width =
          this.filterContainer.nativeElement.parentElement.offsetWidth;
        this.renderer.setStyle(
          this.filterContainer.nativeElement,
          'width',
          `${width}px`
        );
  
        this.productsContainerMinHeight = this.filterContainer.nativeElement.offsetHeight;
  
        this.headerVisibilityService.isVisible.subscribe(
          (menu: {
            visible: boolean;
            scrollUp: boolean;
            currentScroll: number;
          }) => {
            this.scrollUp = menu.scrollUp;
            // if (this.currentWidth > 1023) {
            //   if (menu.scrollUp && menu.visible) {
            //     this.renderer.setStyle(
            //       this.filterContainer.nativeElement,
            //       'margin-top',
            //       `50px`
            //     );
            //   } else {
            //     this.renderer.setStyle(
            //       this.filterContainer.nativeElement,
            //       'margin-top',
            //       `0px`
            //     );
            //   }
            // }
          }
        );
      }

      if (isPlatformBrowser(this.platformId)) {
        this.observer = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            // console.log('El componente esta visible en el viewport');
            this.footerIsVisible = true;
          } else {
            // console.log("EL COMPONENTE NO ESTA EN EL VIEWPORT");
            this.footerIsVisible = false;

            // if(this.filterContainer.nativeElement.classList.value.includes('absolute')){
            //   this.renderer.removeClass(this.filterContainer.nativeElement, 'absolute');
            //   this.renderer.addClass(this.filterContainer.nativeElement, 'fixed');
            //   this.renderer.setStyle(this.filterContainer.nativeElement, 'top', `25px`);
            //   this.renderer.setStyle(this.filterContainer.nativeElement, 'bottom', ``);
            // }
          }
        });

        this.observer.observe(this.outContainer.nativeElement);
        // this.observer.observe(this.paginationContainer.nativeElement);
      }
    });
  }

  onDetailsToggle(event: Event) {

    if(this.filterContainer.nativeElement.offsetHeight && this.filterContainer.nativeElement.offsetHeight > 300){
      this.productsContainerMinHeight = this.filterContainer.nativeElement.offsetHeight;
    }

    // const detailsElement = event.target as HTMLDetailsElement;
    // if (detailsElement.open) {
    //   console.log('El elemento <details> se ha abierto.');
    //   // Agrega aquí la lógica que deseas ejecutar cuando se abre
    // } else {
    //   console.log('El elemento <details> se ha cerrado.');
    //   // Agrega aquí la lógica que deseas ejecutar cuando se cierra
    // }
  }

  openDropDown(current: string){
    if(current === "color"){
      this.openDropDownColor = !this.openDropDownColor;
      this.openDropDownCategory = false;
    }else if(current === "category"){
      this.openDropDownCategory = !this.openDropDownCategory;
      this.openDropDownColor = false;
    }else{
      this.openDropDownColor = false;
      this.openDropDownCategory = false;
    }
  }

  requestNewProducts(){
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.renderer.removeClass(this.filterContainer.nativeElement, 'fixed');
    this.renderer.addClass(this.filterContainer.nativeElement, 'absolute');
    this.renderer.setStyle(this.filterContainer.nativeElement, 'top', ``);
    this.renderer.setStyle(this.filterContainer.nativeElement, 'bottom', ``);

    // this.products = [];
    this.searchProducts();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (this.currentWidth > 1023) {
      const productsContainer = this.productsContainer.nativeElement;
      const filterContainer = this.filterContainer.nativeElement;

      if (productsContainer && filterContainer) {
        const rect = productsContainer.getBoundingClientRect();
        this.currentTopScrollProductsContainer = rect.top;
        const currentClases = filterContainer.classList.value;

        if (!this.footerIsVisible) {
          if (rect.top <= 25) {
            if (currentClases.includes('absolute')) {
              this.renderer.removeClass(filterContainer, 'absolute');
              this.renderer.addClass(filterContainer, 'fixed');
              this.renderer.setStyle(filterContainer, 'top', `25px`);
            }
          } else {
            if (currentClases.includes('fixed')) {
              this.renderer.removeClass(filterContainer, 'fixed');
              this.renderer.addClass(filterContainer, 'absolute');
              this.renderer.setStyle(filterContainer, 'top', ``);
              this.renderer.setStyle(filterContainer, 'bottom', ``);
            }
          }
        } else {
          if (currentClases.includes('fixed')) {
            this.renderer.removeClass(filterContainer, 'fixed');
            this.renderer.addClass(filterContainer, 'absolute');
            this.renderer.setStyle(filterContainer, 'top', ``);
            this.renderer.setStyle(filterContainer, 'bottom', `30px`);
          }
        }
      }

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.loading) {
        // // Incrementa la página y realiza una nueva búsqueda al llegar al final de la página
        // this.page++;
        // this.route.queryParams.subscribe(params => {
        //   const { category, name, minPrice, maxPrice, color } = params;
        //   this.searchProducts(category, name, minPrice, maxPrice, color, this.page);
        // });
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.dropdowncolor.nativeElement.contains(event.target) && !this.dropdowncategory.nativeElement.contains(event.target)) {
      // Si el clic fue fuera de ambas listas desplegables
      this.openDropDownColor = false;
      this.openDropDownCategory = false;
    }
  }

  // Método para actualizar los filtros y realizar la búsqueda
  updateFilters(filterKey: string, value: any) {
    console.log("FILTER KEY => ", value);

    if(filterKey === 'color'){
      this.selectedColor = value;
      this.openDropDownColor = false;
    }else if(filterKey === 'category'){
      this.selectedCategory = value;
      this.openDropDownCategory = false;
    }

    this.filters[filterKey] = value;

    this.filters.page = 1;
    this.filters['pageSize'] = (this.pageSize * this.countForRow);

    this.requestNewProducts();
  }

  resetFilters(filterKey: string){
    if(filterKey === 'color'){
      this.selectedColor = null;
    }else if(filterKey === 'category'){
      this.selectedCategory = null;
    }else if(filterKey === 'name'){
      this.selectedName = null;
    }
    
    this.filters[filterKey] = '';

    this.filters.page = 1;
    this.filters['pageSize'] = (this.pageSize * this.countForRow);

    this.requestNewProducts();
  }

  scrollToMainContainer(): void {
    this.mainContainer.nativeElement.scrollIntoView({'behavior': 'smooth'});
  }

  setCountForRow(cWidth: number) {
    if (cWidth < 768) {
      // SM
      this.countForRow = 2;
      this.MAX_VISIBLE_PAGES = 5;
    } else if (cWidth >= 768 && cWidth < 1024) {
      // MD
      this.countForRow = 3;
      this.MAX_VISIBLE_PAGES = 10;
    } else if (cWidth >= 1024 && cWidth < 1280) {
      // LG
      this.countForRow = 3;
      this.MAX_VISIBLE_PAGES = 10;
    } else if (cWidth >= 1280 && cWidth < 1536) {
      // XL
      this.countForRow = 4;
      this.MAX_VISIBLE_PAGES = 10;
    } else if (cWidth >= 1536) {
      // 2XL
      this.countForRow = 4;
      this.MAX_VISIBLE_PAGES = 10;
    }
  }

  // searchProducts(
  //   category?: string,
  //   name?: string,
  //   minPrice?: number,
  //   maxPrice?: number,
  //   color?: string,
  //   page: number = 1,
  //   pageSize: number = 10
  // ): void {
  //   if (this.loading) return;
  //   this.loading = true;

  //   this.productsSrv
  //     .searchProducts(category, name, minPrice, maxPrice, color, page, (pageSize * this.countForRow))
  //     .subscribe(
  //       (data: IProduct[]) => {
  //         // console.log("PRODUCTS => ", this.products);
  //         this.products = [...this.products, ...data];
  //         this.loading = false;
  //       },
  //       (error) => {
  //         console.error('Error al buscar productos:', error);
  //         this.loading = false;
  //       }
  //     );
  // }

  searchProducts(): void {
    if (this.loading) return;
    this.loading = true;
    this.productError = false;
  
    this.productsSrv
      .searchProducts(
        this.filters
      )
      .subscribe(
        (response) => {

          if(!response.data || !response.data.length){
            this.loading = false;
            this.productError = true;
            this.products = [];

            if(this.filterContainer && this.filterContainer.nativeElement){
              this.productsContainerMinHeight = this.filterContainer.nativeElement.offsetHeight;
            }
            return;
          }

          this.products = response.data;
          this.total = response.total;
          this.currentPage = +response.page;
          this.loading = false;
          this.productError = false;

          this.totalPages = Math.ceil(this.total / this.pageSize);
          // this.totalPages = Math.ceil(this.total / this.pageSize);

          // console.log("RESPUESTA => ", response);
          this.setPages(this.currentPage);

          if(this.filterContainer && this.filterContainer.nativeElement){
            this.productsContainerMinHeight = this.filterContainer.nativeElement.offsetHeight;
          }
        },
        (error) => {
          console.error('Error al buscar productos:', error);
          this.loading = false;
          this.productError = true;
          this.products = [];

          if(this.filterContainer && this.filterContainer.nativeElement){
            this.productsContainerMinHeight = this.filterContainer.nativeElement.offsetHeight;
          }
        }
      );
  }

  setPages(page: number = 1) {
    this.currentPage = page;
    this.totalPages = Math.ceil(this.total / (this.pageSize * this.countForRow));
    this.pages = [];
  
    const MAX_VISIBLE_PAGES = 5; // Ajusta este valor según tus necesidades
  
    let startPage: number, endPage: number;
    if (this.totalPages <= MAX_VISIBLE_PAGES) {
      // Menos de MAX_VISIBLE_PAGES total de páginas, así que muestra todas
      startPage = 1;
      endPage = this.totalPages;
    } else {
      // Más de MAX_VISIBLE_PAGES total de páginas, así que calcula las páginas de inicio y fin
      const maxPagesBeforeCurrentPage = Math.floor(MAX_VISIBLE_PAGES / 2);
      const maxPagesAfterCurrentPage = Math.ceil(MAX_VISIBLE_PAGES / 2) - 1;
      if (page <= maxPagesBeforeCurrentPage) {
        // Cerca del inicio
        startPage = 1;
        endPage = MAX_VISIBLE_PAGES;
      } else if (page + maxPagesAfterCurrentPage >= this.totalPages) {
        // Cerca del final
        startPage = this.totalPages - MAX_VISIBLE_PAGES + 1;
        endPage = this.totalPages;
      } else {
        // En algún lugar en el medio
        startPage = page - maxPagesBeforeCurrentPage;
        endPage = page + maxPagesAfterCurrentPage;
      }
    }
  
    // Crea un arreglo de páginas para ngFor en el template
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }
  
  // setPages(page: number = 1) {
  //   this.currentPage = page;

  //   console.log("CURRENT PAGE => ", this.currentPage);
  //   console.log("NEW PAGE => ", page);

  //   this.totalPages = Math.ceil(this.total / (this.pageSize * this.countForRow));

  //   console.log("TOTAL => ", this.total);
  //   console.log("PAGE SIZE => ", this.pageSize);
  //   console.log("TOTAL PAGES => ", this.totalPages);

  //   this.pages = [1]; // La página 1 siempre estará visible
  
  //   let startPage: number, endPage: number;
  //   let ellipsis = false;
  
  //   if (this.totalPages <= this.MAX_VISIBLE_PAGES) {
  //     // Menos de MAX_VISIBLE_PAGES total de páginas, así que muestra todas
  //     startPage = 2;
  //     endPage = this.totalPages;
  //   } else {
  //     // Más de MAX_VISIBLE_PAGES total de páginas, así que calcula las páginas de inicio y fin
  //     if (page < 7) {
  //       // Cerca del inicio
  //       startPage = 2;
  //       endPage = this.MAX_VISIBLE_PAGES - 1;
  //       ellipsis = true;
  //     } else if (page >= 7 && page < this.totalPages - 3) {
  //       // En algún lugar en el medio
  //       const pagesBefore = Math.floor((this.MAX_VISIBLE_PAGES - 4) / 2);
  //       const pagesAfter = Math.ceil((this.MAX_VISIBLE_PAGES - 4) / 2);
  
  //       startPage = page - pagesBefore;
  //       endPage = page + pagesAfter;
  //       ellipsis = true;
  //     } else {
  //       // Cerca del final
  //       startPage = this.totalPages - (this.MAX_VISIBLE_PAGES - 3);
  //       endPage = this.totalPages;
  //     }
  //   }
  
  //   // Crea un arreglo de páginas para ngFor en el template
  //   for (let i = startPage; i <= endPage; i++) {
  //     this.pages.push(i);
  //   }
  
  //   if (ellipsis && page < this.totalPages - 3) {
  //     this.pages.push('...');
  //   }
  
  //   if (page < this.totalPages - 3) {
  //     this.pages.push(this.totalPages);
  //   }
  // }
  
  // setPages(page: number = 1) {
  //   this.currentPage = page;
  //   this.totalPages = Math.ceil(this.total / (this.pageSize * this.countForRow));
  //   this.pages = [];
  
  //   let startPage: number, endPage: number;
  //   if (this.totalPages <= this.MAX_VISIBLE_PAGES) {
  //     // menos de MAX_VISIBLE_PAGES total de páginas, así que muestra todas
  //     startPage = 1;
  //     endPage = this.totalPages;
  //   } else {
  //     // más de MAX_VISIBLE_PAGES total de páginas, así que calcula las páginas de inicio y fin
  //     const maxPagesBeforeCurrentPage = Math.floor(this.MAX_VISIBLE_PAGES / 2);
  //     const maxPagesAfterCurrentPage = Math.ceil(this.MAX_VISIBLE_PAGES / 2) - 1;
  //     if (page <= maxPagesBeforeCurrentPage) {
  //       // cerca del inicio
  //       startPage = 1;
  //       endPage = this.MAX_VISIBLE_PAGES;
  //     } else if (page + maxPagesAfterCurrentPage >= this.totalPages) {
  //       // cerca del final
  //       startPage = this.totalPages - this.MAX_VISIBLE_PAGES + 1;
  //       endPage = this.totalPages;
  //     } else {
  //       // en algún lugar en el medio
  //       startPage = page - maxPagesBeforeCurrentPage;
  //       endPage = page + maxPagesAfterCurrentPage;
  //     }
  //   }
  
  //   // crea un arreglo de páginas para ngFor en el template
  //   for (let i = startPage; i <= endPage; i++) {
  //     this.pages.push(i);
  //   }
  // }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.filters.page = page;
    this.requestNewProducts();
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
  
  addToCard(product: IProduct) {
    try {
      if (!this.userData) {
        this.modalSrv.showModal();
        return;
      }

      product.loading = true;

      const cardItem: ICartItem = {
        quantity: 1,
        product: {
          id: product.id,
          identifier: product.identifier,
          name: product.name,
          imageUrl: product.imageUrl || 'placeholder.jpg',
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          sizes: product.sizes,
          size: /*product.sizes ? product.sizes[0] : null*/ product.size || null,
          color: product.colors ? product.colors[0] : null,
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
            'red-500'
          );
          product.loading = false;
        }
      );
    } catch (error) {
      product.loading = false;
      this.toastSrv.showToast(
        '¡Ups! No se pudo agregar el artículo al carrito',
        'red-500'
      );
    }
  }

  sanitizeAndUpperCase(input: string): string {
    if(!input || !input.length) return '';

    // Elimina los caracteres especiales y los espacios en blanco de los lados
    const sanitizedInput = input.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    // Convierte el resultado a mayúsculas
    return sanitizedInput.toUpperCase();
  }

  sanitizeAndCapitalize(input: string): string {
    if(!input || !input.length) return '';

    // Elimina los caracteres especiales y los espacios en blanco de los lados
    const sanitizedInput = input.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    // Capitaliza la primera letra del resultado
    const capitalizedInput = sanitizedInput.charAt(0).toUpperCase() + sanitizedInput.slice(1);
    return capitalizedInput;
  }
  
  ngOnDestroy(): void {
    // Asegurarse de desuscribirse del observable cuando el componente se destruya
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
