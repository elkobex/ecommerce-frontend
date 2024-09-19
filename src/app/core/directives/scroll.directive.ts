import { Directive, HostListener } from '@angular/core';
import { HeaderVisibilityService } from '../services/header-visible.service';
import { OverlayService } from '../services/overlay.service';

@Directive({
  selector: '[appScroll]',
  standalone: true
})
export class ScrollDirective {

  private lastScrollTop = 0;
  private showOnScrollUp = false;

  constructor(private headerVisibilityService: HeaderVisibilityService, private overlay: OverlayService) {}

  @HostListener('window:scroll', [])
  onScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    this.overlay.hideOverlay();

    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      this.headerVisibilityService.hideHeader(this.showOnScrollUp, currentScroll);
    } else if (currentScroll < this.lastScrollTop) {
      this.showOnScrollUp = currentScroll > 64;
      this.headerVisibilityService.showHeader(this.showOnScrollUp, currentScroll);
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

}
