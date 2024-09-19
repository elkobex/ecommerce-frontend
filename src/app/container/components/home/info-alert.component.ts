import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-info-alert',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="flex flex-col max-w-[1300px] mx-auto border border-green-700 rounded-xl overflow-hidden"
    >
      <div
        class="bg-green-700 flex flex-col md:flex-row justify-between items-center p-1.5 rounded-t-xl"
      >
        <div class="flex space-x-1 mb-2 md:mb-0">
          <img
            class="w-6 h-6"
            src="/assets/icons/seguridad.png"
            alt="Compromisos Temu"
          />
          <span class="text-white">Nuestro Compromisos</span>
        </div>

        <div
          class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-8"
        >
          <div class="flex items-center space-x-1">
            <img
              class="w-6 h-6"
              src="/assets/icons/candado.png"
              alt="Privacidad asegurada"
            />
            <span class="text-white">Privacidad asegurada</span>
          </div>
          <div class="flex items-center space-x-1">
            <img
              class="w-6 h-6"
              src="/assets/icons/pagos.png"
              alt="Pagos seguros"
            />
            <span class="text-white">Pagos seguros</span>
          </div>
          <div class="flex items-center space-x-1">
            <img
              class="w-6 h-6"
              src="/assets/icons/camion.png"
              alt="Entrega garantizada"
            />
            <span class="text-white">Entrega garantizada</span>
          </div>
        </div>
      </div>

      <!-- border-t-2 border-green-600 -->
      <div
        class="flex flex-col md:flex-row items-center justify-between p-2 "
      >
        <div class="flex items-center space-x-2 mb-2 md:mb-0">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            class="_29QLmVrs"
            style="fill: #0a8800"
            role="img"
            alt=""
            aria-label=""
          >
            <path
              d="M829.7 783.4l-54.9-97.2c-25.4-44.9-38.8-96.2-38.8-148.5l0-85.1c0-107.5-67.6-198.4-160-227.7l0-61c0-37.4-28.7-67.9-64-67.9-35.3 0-64 30.5-64 67.9l0 61c-92.4 29.3-160 120.2-160 227.7l0 85.1c0 52.3-13.4 103.7-38.8 148.5l-54.9 97.2c-3 5.3-3 11.8-0.2 17.1 2.8 5.3 8.1 8.6 13.9 8.6l608 0c5.8 0 11.1-3.3 13.9-8.5 2.8-5.3 2.7-11.9-0.2-17.2z m-317.7 144.6c47.1 0 87.6-29.3 106.7-71.3l-213.4 0c19.1 42 59.5 71.3 106.7 71.3z"
            ></path>
          </svg>
          <span class="text-green-600 font-medium"
            >Navega de forma segura y disfruta de precios súper bajos y las
            mejores ofertas.</span
          >
        </div>
        <div [routerLink]="['products']" class="flex items-center space-x-2 cursor-pointer">
          <span class="text-green-600 font-medium">Ver</span>
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            class="_24D_XJ67"
            style="fill: #0a8800"
            role="img"
            alt=""
            aria-label=""
          >
            <path
              d="M323.7 111.7c19.8-19.8 50.7-21.8 72.7-5.9l6.9 5.9 362.1 362.1c19.8 19.8 21.8 50.7 5.9 72.6l-5.9 7-362.1 362.1c-22 22-57.7 22-79.6 0-19.8-19.8-21.8-50.7-5.9-72.7l5.9-7 322.1-322.2-322.1-322.2c-19.8-19.8-21.8-50.7-5.9-72.7l5.9-7z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class InfoAlertComponent {}
