import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/footer/footer.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { HeaderComponent } from "./components/header/header.component";
import { BannerInfoComponent } from "./components/banner-info/banner-info.component";
import { LoginModalComponent } from "../core/components/login-modal/login-modal.component";
import { OverlayService } from '../core/services/overlay.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../core/services/toast.service';
import { ScrollDirective } from '../core/directives/scroll.directive';
import { HeaderVisibilityService } from '../core/services/header-visible.service';
import { CartService } from '../core/services/cart.service';
import { ICartItem } from '../container/interfaces/cardItem.interface';
import { ModalService } from '../core/services/modal.service';
import { IUser } from '../core/interfaces/user.interface';
import { AddressModalComponent } from "../core/components/address-modal/address-modal.component";
import { SmoothScrollDirective } from '../core/directives/smooth-scroll.directive';
import { FloatingActionButtonComponent } from "../core/components/floating-action-button/floating-action-button.component";

@Component({
    selector: 'layout-page',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    imports: [RouterOutlet, CommonModule, FooterComponent, SpinnerComponent, HeaderComponent, BannerInfoComponent, LoginModalComponent, ScrollDirective, SmoothScrollDirective, AddressModalComponent, FloatingActionButtonComponent]
})
export class LayoutComponent {
  @ViewChild('header') header!: ElementRef;
  @ViewChild('banner') banner!: ElementRef;
  
  private overlaySubscription!: Subscription;
  private toastSubscription  !: Subscription;
  private cartSubscription   !: Subscription;

  private newItemAddedTimeout: any;

  outHeightModal: number = 0;
  headerHeight: number = 0;
  showOverlay = signal(false);

  currentScroll: number = 0;
  isHeaderVisible: boolean = true;

  newItemAdded = signal<ICartItem | null>(null);

  toastAlert!: { show: boolean; message: string; color: string };

  private modalAddressSuscription!: Subscription;
  modalAddressData = signal<{status: boolean; user: IUser | null}>({
    status: false,
    user: null
  });

  private authSuscription!: Subscription;
  modalAuth = signal<boolean>(false);
  
  
  constructor(private router: Router, private overlaySrv: OverlayService, private toastSrv: ToastService, private headerVisibilityService: HeaderVisibilityService, private cartSrv: CartService, private modalSrv: ModalService){
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.headerHeight = this.header.nativeElement?.offsetHeight;
      const bannerHeight = this.banner.nativeElement?.offsetHeight;
      this.outHeightModal = this.headerHeight + bannerHeight;
    });
  }

  ngOnInit() {
    this.authSuscription = this.modalSrv.getModalStatus().subscribe(
      (isDisplayed: boolean) => {
        this.modalAuth.set(isDisplayed);
      }
    );

    this.toastSubscription = this.toastSrv.getToastStatus().subscribe((status: { show: boolean; message: string; color: string }) => {
      this.toastAlert = status;
    });

    this.headerVisibilityService.isVisible.subscribe((menu: {visible: boolean, currentScroll: number}) => {
      this.isHeaderVisible = menu.visible;
      this.currentScroll = menu.currentScroll;
    });

    this.overlaySubscription = this.overlaySrv.getOverlayStatus().subscribe((status: boolean) => {
      this.showOverlay.set(status);
    });

    this.cartSubscription = this.cartSrv.getCartNotifyNewItem().subscribe((item: ICartItem | null) => {
      // Cancelar el temporizador anterior si existe
      if (this.newItemAddedTimeout) {
        clearTimeout(this.newItemAddedTimeout);
      }
    
      // Establece el nuevo artículo
      this.newItemAdded.set(item);
    
      // Inicia un nuevo temporizador de 5 segundos para restablecer newItemAdded a null
      this.newItemAddedTimeout = setTimeout(() => {
        this.newItemAdded.set(null);
      }, 3000);
    });

    this.modalAddressSuscription = this.modalSrv.getModalAddressStatus().subscribe((data: {status: boolean, user: IUser | null}) => {
      this.modalAddressData.set(data);
    });
  }

  goToCart(){
    // this.router.navigate(['/detail', this.newItemAdded()?.product.identifier])
    this.router.navigate(['/cart'])
  }
  
  hideToast() {
    this.toastSrv.hideToast();
  }

  ngOnDestroy() {
    if (this.authSuscription) {
      this.authSuscription.unsubscribe();
    }
    if (this.overlaySubscription) {
      this.overlaySubscription.unsubscribe();
    }
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if(this.modalAddressSuscription){
      this.modalAddressSuscription.unsubscribe();
    }
  }
}
