import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderVisibilityService } from '../../services/header-visible.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-floating-action-button',
  standalone: true,
  imports: [],
  templateUrl: './floating-action-button.component.html',
  styleUrl: './floating-action-button.component.scss'
})
export class FloatingActionButtonComponent implements OnInit {
  showButton = signal<boolean>(false);
  headerVisibilitySrv = inject(HeaderVisibilityService);
  headerVisibilitySuscription!: Subscription;

  ngOnInit(): void {
    this.headerVisibilitySuscription = this.headerVisibilitySrv.isVisible.subscribe((data) => {
      this.showButton.set(data.currentScroll > 500);
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
