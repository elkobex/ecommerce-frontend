import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section
      id="coupons"
      class="flex flex-col justify-center items-center h-full text-center"
    >
      <img class="w-32 h-32" src="/assets/icons/not-coupons.png" alt="" />
      <p class="text-lg text-gray-600">
        No tienes ningún cupón u oferta disponibles.
      </p>
      <p class="text-sm text-gray-500 mt-2">¡Revisa pronto para más ofertas!</p>

      <div class="mt-8"></div>

      <input
        id="coupon"
        name="coupon"
        type="text"
        [(ngModel)]="coupon().coupon"
        autocomplete="off"
        placeholder="Ingresa el código del cupón"
        class="w-60 p-2 text-neutral-800 placeholder-slate-300 transition duration-500 ease-in-out transform border border-gray-300 rounded-md focus:outline-none focus:border-transparent focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-slate-400"
        [disabled]="coupon().loading"
      />

      @if (coupon().error) {
        <div
          class="inline-flex items-center space-x-2 text-red-500 vibrate mb-2"
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 1024 1024"
            version="1.1"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M512 0c282.8 0 512 229.2 512 512 0 282.8-229.2 512-512 512-282.8 0-512-229.2-512-512 0-282.8 229.2-512 512-512z m0 78.8c-239.3 0-433.2 194-433.2 433.2 0 239.3 194 433.2 433.2 433.2 239.3 0 433.2-194 433.2-433.2 0-239.3-194-433.2-433.2-433.2z m3.9 590.7c32.6 0 59.1 26.4 59.1 59.1 0 32.6-26.4 59.1-59.1 59.1-32.6 0-59.1-26.4-59-59.1 0-32.6 26.4-59.1 59-59.1z m-3.9-463.4c23.5 0 43 17.1 46.6 39.6l0.7 7.6 0 307.3c0 26.1-21.2 47.3-47.3 47.3-23.5 0-43-17.1-46.6-39.6l-0.7-7.7 0-307.3c0-26.1 21.2-47.3 47.3-47.2z"
            ></path>
          </svg>
          <span class="text-sm">{{ coupon().message }}</span>
        </div>
      } @else {
        <div class="mb-2"></div>
      }

      @if (!coupon().loading) {
        <button
          type="button"
          (click)="applyCoupon()"
          class="text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 inline-flex items-center"
        >
          Aplicar
        </button>
      } @else {
        <button
          disabled
          type="button"
          class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-slate-700 focus:text-slate-700 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            class="inline w-4 h-4 me-3 text-gray-200 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#1C64F2"
            />
          </svg>
          Aplicando
        </button>
      }
    </section>
  `,
  styles: `
    .vibrate {
      animation: vibrate 0.2s alternate;
    }

    @keyframes vibrate {
      0% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-2px);
      }
      50% {
        transform: translateX(2px);
      }
      75% {
        transform: translateX(-2px);
      }
      100% {
        transform: translateX(2px);
      }
    }
  `,
})
export class CouponsComponent {
  coupon = signal<{
    loading: boolean;
    error: boolean;
    message: string;
    coupon: string;
  }>({
    loading: false,
    error: false,
    message: '',
    coupon: '',
  });

  applyCoupon() {
    this.coupon().loading = true;
    this.coupon().error = false;

    let currentCoupon = this.coupon().coupon;
    if (!currentCoupon || !currentCoupon.length) {
      this.coupon.set({
        loading: false,
        error: true,
        message: `Ingresa un código de cupón.`,
        coupon: '',
      });
      return;
    }

    setTimeout(() => {
      this.coupon.set({
        loading: false,
        error: true,
        message: `Lo sentimos, este código no es válido. Asegúrate de ingresarlo correctamente.`,
        coupon: '',
      });
    }, 1500);
  }
}
