import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { BannerSliderComponent } from '../../components/home/banner-slider.component';
import { CategoriesSliderComponent } from '../../components/home/categories-slider.component';

import { register } from 'swiper/element/bundle';
import { ProductListComponent } from '../../components/home/product-list.component';
import { InfoAlertComponent } from '../../components/home/info-alert.component';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
register();

@Component({
  selector: 'home-page',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    BannerSliderComponent,
    CategoriesSliderComponent,
    ProductListComponent,
    InfoAlertComponent,
  ],
})
export class HomeComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadMore() {
    // Navega al componente 'products' sin parámetros
    this.router.navigate(['/products'], { queryParams: {} });
    // location.href = "/products";
  }
}
