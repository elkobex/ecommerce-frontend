import { Directive, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { OverlayService } from '../services/overlay.service';
import { CartService } from '../services/cart.service';
import { HeaderVisibilityService } from '../services/header-visible.service';

@Directive({
  selector: '[appSmoothScroll]',
  standalone: true
})
export class SmoothScrollDirective {

  private cartSrv = inject(CartService);
  private overlaySrv = inject(OverlayService);
  private viewportScroller = inject(ViewportScroller);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private headerVisibilityService: HeaderVisibilityService, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          console.log("CAMBIAR");
          this.cartSrv.hideNotifyNewItem();
          this.overlaySrv.hideOverlay();
          this.viewportScroller.scrollToPosition([0, 0]); // No es necesario cambiar este método.
          this.headerVisibilityService.showHeader(false, 0);
          document.body.classList.toggle('overflow-hidden', false);
        }
      });
    }
  }
}