import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories-slider',
  standalone: true,
  imports: [RouterModule],
  schemas: [],
  template: `

<p class="mx-auto mt-10 mb-5 max-w-[100px] text-xl md:text-2xl font-bold text-slate-900 text-center">
  CATEGORIAS
</p>
<section
  class="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-3 lg:gap-5"
>
  <!-- 1 -->
  <a [routerLink]="['/products']" [queryParams]="{name: 'Hombre'}">
    <div class="relative cursor-pointer overflow-hidden">
      <img
        class="mx-auto h-auto w-auto brightness-50 duration-300 hover:brightness-100 transform hover:scale-110"
        src="/assets/img/men.png"
        alt="Ropa para hombre"
      />
      <p
        class="pointer-events-none absolute top-1/2 left-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 text-center text-white lg:text-xl"
      >
        Hombre
      </p>
    </div>
  </a>

  <!-- 2 -->
  <a [routerLink]="['/products']" [queryParams]="{name: 'Niños'}">
    <div class="relative cursor-pointer overflow-hidden">
      <img
        class="mx-auto h-auto w-auto brightness-50 duration-300 hover:brightness-100 transform hover:scale-110"
        src="/assets/img/boy.jpg"
        alt="Ropas para niños"
      />
      <p
        class="pointer-events-none absolute top-1/2 left-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 text-center text-white lg:text-xl"
      >
        Niños
      </p>
    </div>
  </a>

  <!-- 3 -->
  <a [routerLink]="['/products']" [queryParams]="{name: 'Polo'}">
    <div class="relative cursor-pointer overflow-hidden">
      <img
        class="mx-auto h-auto w-auto brightness-50 duration-300 hover:brightness-100 transform hover:scale-110"
        src="/assets/img/polo.jpg"
        alt="Polo para hombres"
      />
      <p
        class="pointer-events-none absolute top-1/2 left-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 text-center text-white lg:text-xl"
      >
        Polo
      </p>
    </div>
  </a>
</section>

  `,
  styles: ``,
})
export class CategoriesSliderComponent {

  constructor(private router: Router){

  }

  goProductsByCategory(text: string){
    this.router.navigate(['/products'], { queryParams: {name: text} });
  }
}