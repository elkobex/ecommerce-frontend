import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { IUser } from '../../../core/interfaces/user.interface';
import { OverlayService } from '../../../core/services/overlay.service';
import { ToastService } from '../../../core/services/toast.service';
import { CartModalComponent } from '../complemets/cart-modal.component';
import { HeaderVisibilityService } from '../../../core/services/header-visible.service';
import { CartService } from '../../../core/services/cart.service';
import { ICartItem } from '../../../container/interfaces/cardItem.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CartModalComponent, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;

  mobileGlobalMenu = signal(false);
  mobileAccountMenu = signal(false);
  desktopGlobalMenu = signal(false);

  userData!: IUser | null;
  isLoggedIn = false;

  displayName: string = '';
  searchValue: string = '';

  mouseHoverOnBtnCategory: boolean = false;
  hoverDelayTimer: any;

  mouseHoverOnCategories: boolean = false;
  selectedCategoryIndex: number | null = 0;

  categories = [
    {
      name: 'Hombre',
      subcategories: [
        {
          name: 'Polos',
          opciones: [
            { name: 'Deportivos', value: 'deportivos', type: 'name' },
            { name: 'Casuales', value: 'casuales', type: 'name' },
            { name: 'Playeras', value: 'playeras', type: 'name' },
            { name: 'Chaquetas', value: 'chaquetas', type: 'name' },
          ],
        },
        {
          name: 'Pantalones',
          opciones: [
            { name: 'Vestir', value: 'vestir', type: 'name' },
            { name: 'Shots', value: 'shots', type: 'name' },
            { name: 'Casuales', value: 'casuales', type: 'name' },
            { name: 'Deportivos', value: 'deportivos', type: 'name' },
          ],
        },
        {
          name: 'Camisas',
          opciones: [
            { name: 'Blancas', value: 'blancos', type: 'color' },
            { name: 'Negras', value: 'negros', type: 'color' },
            { name: 'Rojas', value: 'rojos', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
        {
          name: 'Gorras',
          opciones: [
            { name: 'Blancas', value: 'blancos', type: 'color' },
            { name: 'Negras', value: 'negros', type: 'color' },
            { name: 'Rojas', value: 'rojos', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
      ],
      expanded: true,
    },
    {
      name: 'Niños',
      subcategories: [
        {
          name: 'T-Shirt',
          opciones: [
            { name: 'Beige', value: 'beige', type: 'color' },
            { name: 'Rojos', value: 'rojos', type: 'color' },
            { name: 'Blancos', value: 'blancos', type: 'color' },
            { name: 'Naranjas', value: 'naranjas', type: 'color' },
          ],
        },
        {
          name: 'Gorras',
          opciones: [
            { name: 'Blancas', value: 'blancos', type: 'color' },
            { name: 'Negras', value: 'negros', type: 'color' },
            { name: 'Rojas', value: 'rojos', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
        {
          name: 'Bolsas',
          opciones: [
            { name: 'Azules', value: 'azules', type: 'color' },
            { name: 'Negros', value: 'negros', type: 'color' },
            { name: 'Azul Marino', value: 'azul marino', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
        {
          name: 'Calcetines',
          opciones: [
            { name: 'Blancas', value: 'blancos', type: 'color' },
            { name: 'Negras', value: 'negros', type: 'color' },
            { name: 'Rojas', value: 'rojos', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
      ],
      expanded: false,
    },
    {
      name: 'Accesorios',
      subcategories: [
        {
          name: 'Capuchas',
          opciones: [
            { name: 'Beige', value: 'beige', type: 'color' },
            { name: 'Azules', value: 'azules', type: 'color' },
            { name: 'Blancos', value: 'blancos', type: 'color' },
            { name: 'Negros', value: 'negros', type: 'color' },
          ],
        },
        {
          name: 'Mochilas',
          opciones: [
            { name: 'Negras', value: 'negros', type: 'color' },
            { name: 'Azules', value: 'azules', type: 'color' },
            { name: 'Rojas', value: 'rojos', type: 'color' },
            { name: 'Rosas', value: 'rosas', type: 'color' },
          ],
        },
        {
          name: 'Sombreros',
          opciones: [
            { name: 'Azules', value: 'azules', type: 'color' },
            { name: 'Negros', value: 'negros', type: 'color' },
            { name: 'Blancos', value: 'blancos', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
        {
          name: 'Cartelas',
          opciones: [
            { name: 'Rosas', value: 'rosas', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
            { name: 'Azules', value: 'azules', type: 'color' },
            { name: 'Verdes', value: 'verdes', type: 'color' },
          ],
        },
      ],
      expanded: false,
    },
  ];

  currentScroll: number = 0;
  isHeaderVisible: boolean = true;
  showOnScrollUp: boolean = false;

  totalQuantityCart = signal(0);

  constructor(
    private authSrv: AuthService,
    private modalSrv: ModalService,
    private overlaySrv: OverlayService,
    private toastSrv: ToastService,
    private cartSrv: CartService,
    private router: Router,
    private headerVisibilityService: HeaderVisibilityService
  ) {
    this.authSrv.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn) {
        this.userData = this.authSrv.retrieveUserData();
        this.displayName = `${this.userData?.name} ${this.userData?.lastName}`;
      }
    });
  }

  ngOnInit(): void {
    this.headerVisibilityService.isVisible.subscribe((menu: {visible: boolean, scrollUp: boolean, currentScroll: number}) => {
      this.isHeaderVisible = menu.visible;
      this.currentScroll = menu.currentScroll;
      this.showOnScrollUp = menu.scrollUp;

      this.mouseHoverOnCategories = false;
    });

    this.cartSrv.getCartStatus().subscribe((items: ICartItem[]) => {
      this.totalQuantityCart.set(this.getTotalQuantity(items));
    });
  }

  getTotalQuantity(items: ICartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  openLoginModal() {
    this.modalSrv.showModal();
  }

  logout() {
    this.authSrv.logout();
  }

  toggleMobileGlobalMenu() {
    this.mobileAccountMenu.set(false);
    this.mobileGlobalMenu.set(!this.mobileGlobalMenu());

    if(this.mobileGlobalMenu()){
      this.overlaySrv.showOverlay();
    }else{
      this.closeOverlay0();
    }
  
    // Agrega o elimina la clase 'overflow-hidden' con una transición suave
    document.body.classList.toggle('overflow-hidden', this.mobileGlobalMenu());
  
    // Agrega o elimina una clase para animar la opacidad del menú
    const mobileMenuElement = document.getElementById('global-mobile-menu');
    if (this.mobileGlobalMenu()) {
      mobileMenuElement?.classList.add('fade-in');
    } else {
      mobileMenuElement?.classList.remove('fade-in');
    }
  
    // this.closeOverlay0();
  }

  toggleMobileAccountMenu() {
    this.mobileGlobalMenu.set(false);
    this.mobileAccountMenu.set(!this.mobileAccountMenu());

    if(this.mobileAccountMenu()){
      this.overlaySrv.showOverlay();
    }else{
      this.closeOverlay0();
    }

    document.body.classList.toggle('overflow-hidden', this.mobileAccountMenu());

     // Agrega o elimina una clase para animar la opacidad del menú
     const mobileMenuElement = document.getElementById('account-mobile-menu');

    if (this.mobileAccountMenu()) {
      mobileMenuElement?.classList.add('fade-in');
    } else {
      mobileMenuElement?.classList.remove('fade-in');
    }
    // this.closeOverlay0();
  }

  toggleCategory(index: number): void {
    // Verifica si el índice seleccionado es igual al actual
    // Si es así, alterna el estado de 'expanded'
    if (this.selectedCategoryIndex === index) {
      this.categories[index].expanded = !this.categories[index].expanded;
    } else {
      // Si se selecciona una categoría diferente,
      // colapsa la categoría anterior y expande la nueva
      if (this.selectedCategoryIndex !== null) {
        this.categories[this.selectedCategoryIndex].expanded = false;
      }
      this.categories[index].expanded = true;
      this.selectedCategoryIndex = index;
    }
  }

  closeOverlay0() {
    this.overlaySrv.hideOverlay();
  }

  openOverlay0() {
    if (this.userData) {
      this.overlaySrv.showOverlay();
    }
  }

  selectCategory(index: number) {
    this.selectedCategoryIndex = index;
  }

  goProductsByCategory(category: string, colorOrName: string, type: string){
    // if(type === 'color'){
    //   this.router.navigate(['/products'], { queryParams: {category, color: colorOrName} });
    // }else{
    //   this.router.navigate(['/products'], { queryParams: {category, name: colorOrName} });
    // }

    this.mouseHoverOnCategories = false;
    this.closeOverlay0();

    let filter = category.includes('s') ? category.substring(0, category.length -1 ) : category;
    this.router.navigate(['/products'], { queryParams: {name: filter} });
  }

  performSearch(query: string): void {
    console.log('Buscando:', query);
    if (!query) return; // Verifica que el input no esté vacío
    // Realiza la búsqueda con el texto ingresado
    // Aquí puedes agregar la lógica para realizar la búsqueda
    // Por ejemplo, podrías navegar a la ruta de productos con el parámetro de búsqueda
    this.router.navigate(['/products'], { queryParams: { name: query } });
    this.searchInput.nativeElement.value = "";
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.mouseHoverOnBtnCategory || this.mouseHoverOnCategories) {
      this.desktopGlobalMenu.set(true);
    } else {
      this.desktopGlobalMenu.set(false);
    }
  }
}
