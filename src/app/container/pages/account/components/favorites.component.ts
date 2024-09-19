import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section
      id="favorites"
      class="flex flex-col justify-center items-center h-full text-center"
    >
      <svg
        class="w-28 h-28 pt-5 mb-2"
        fill="none"
        stroke="#9ca3af"
        stroke-width=".5"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        ></path>
      </svg>

      <span class="text-lg text-gray-600 font-semibold"
        >Lista de Favoritos Vacía</span
      >
      <p class="text-gray-500">Aún no has agregado nada a tus favoritos.</p>
      <p class="text-sm text-gray-400 mt-2">
        Explora y agrega tus ítems preferidos para encontrarlos rápidamente
        aquí.
      </p>

      <div class="mt-8">
        <a
          [routerLink]="['/products']"
          class="inline-block px-4 py-2 text-sm text-slate-700 border border-slate-700  bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          Ver productos
        </a>
      </div>
    </section>
  `,
  styles: ``,
})
export class FavoritesComponent {}
