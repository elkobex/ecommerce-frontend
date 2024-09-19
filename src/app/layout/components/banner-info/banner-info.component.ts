import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-banner-info',
  standalone: true,
  imports: [],
  templateUrl: './banner-info.component.html',
  styleUrl: './banner-info.component.scss'
})
export class BannerInfoComponent {
  elements = ['element1', 'element2', 'element3'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  randomVibration() {
    if (isPlatformBrowser(this.platformId)) {
      const randomElementId = this.elements[Math.floor(Math.random() * this.elements.length)];
      const element = document.getElementById(randomElementId);
      if(element){
        element.classList.add('animate-bounce');
  
        setTimeout(() => {
          element.classList.remove('animate-bounce');
        }, 2000); // Duración de la animación de vibración
      }
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Intervalo de tiempo aleatorio para la vibración
      setInterval(() => this.randomVibration(), 3000);
    }
  }
}