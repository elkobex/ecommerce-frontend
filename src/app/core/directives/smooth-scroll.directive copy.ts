import { isPlatformBrowser } from '@angular/common';
import { Directive, inject, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OverlayService } from '../services/overlay.service';
import { CartService } from '../services/cart.service';
import { HeaderVisibilityService } from '../services/header-visible.service';

@Directive({
  selector: '[appSmoothScroll]',
  standalone: true
})
export class SmoothScrollDirective {

  private cartSrv   = inject(CartService);
  private overlaySrv = inject(OverlayService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private headerVisibilityService: HeaderVisibilityService, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.cartSrv.hideNotifyNewItem();
          this.overlaySrv.hideOverlay();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.headerVisibilityService.showHeader(false, 0);
          document.body.classList.toggle('overflow-hidden', false);
        }
      });
    }
  }

}
