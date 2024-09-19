import {
  AfterViewInit,
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { IUser } from '../../../../core/interfaces/user.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ModalService } from '../../../../core/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section id="address" class="flex flex-col items-center justify-center h-full mt-5">
      <div
        class="w-full bg-white border border-gray-200 cursor-pointer rounded-md relative"
      >
        <div class="flex justify-between p-4">
          <div class="flex flex-col space-y-2">
            <div class="inline-flex flex-wrap">
              <span class="font-semibold text-base text-gray-800">{{
                userData()?.fullName
                  ? userData()?.fullName
                  : userData()?.name + ' ' + userData()?.lastName
              }}</span>
              <span>&nbsp;</span>
              @if (userData()?.country && userData()?.country?.code) {
                <span class="text-gray-600"
                  >({{
                    this.findAreaCodeByCountryCode(
                      userData()?.country?.code || 'MX'
                    )
                  }}&nbsp;{{
                    userData()?.phone ? userData()?.phone : ''
                  }})</span
                >
              } @else {
                <span class="text-gray-600"
                  >({{ userData()?.phone ? userData()?.phone : '' }})</span
                >
              }
            </div>
            <span
              class="inline-flex flex-wrap text-base font-semibold text-orange-500"
            >
              @if (userData()?.address) {
                <span>{{
                  userData()?.address ? userData()?.address : 'Sin dirección'
                }}</span>
                <span>,&nbsp;</span>
                <span
                  >{{
                    userData()?.country?.code ? userData()?.country?.code : ''
                  }}-{{ userData()?.zipCode ? userData()?.zipCode : '' }}</span
                >
              } @else {
                <span>Sin dirección</span>
              }
            </span>
            <span
              class="inline-flex flex-wrap text-base font-semibold text-gray-700"
            >
              @if (userData()?.city) {
                <span>{{ userData()?.city ? userData()?.city : '' }}</span>
                <span>,&nbsp;</span>
                <span
                  >{{
                    userData()?.state?.name ? userData()?.state?.name : ''
                  }}
                  ({{
                    userData()?.state?.code ? userData()?.state?.code : ''
                  }})</span
                >
                <span>,&nbsp;</span>
                <span>{{
                  userData()?.country?.name ? userData()?.country?.name : ''
                }}</span>
              } @else {
                <span class="text-gray-600"
                  >Por favor, establezca una dirección de envío. 🌎</span
                >
              }
            </span>
          </div>

          <div
            class="hover:bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center"
          >
            <svg
              (click)="editAddress()"
              class="h-4 w-4 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1024 1024"
              fill="currentColor"
              role="img"
            >
              <path
                d="M480 153.4c21.2 0 38.4 17.2 38.4 38.4 0 19.1-13.9 34.9-32.2 37.9l-6.2 0.5-234.7 0c-40.9 0-74.5 31.1-78.5 70.8l-0.4 8.1 0 469.3c0 40.9 31.1 74.5 70.9 78.6l8 0.4 469.4 0c40.9 0 74.5-31.1 78.5-70.9l0.4-8.1 0-234.6c0-21.2 17.2-38.4 38.4-38.4 19.1 0 34.9 13.9 37.9 32.1l0.5 6.3 0 234.6c0 82.6-64.3 150.1-145.5 155.4l-10.2 0.4-469.4 0c-82.6 0-150.1-64.3-155.4-145.5l-0.3-10.3 0-469.3c0-82.6 64.3-150.1 145.5-155.4l10.2-0.3 234.7 0z m402-5.3c15 15 15 39.3 0 54.3l-352.9 353c-15 15-39.3 15-54.3 0-15-15-15-39.3 0-54.3l352.9-353c15-15 39.3-15 54.3 0z"
              ></path>
            </svg>
          </div>
        </div>


        <div class="inline-flex space-x-1 items-center justify-start p-4">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" role="img" class="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-500"><path d="M536.4 61c222.2 0 402.3 181.5 402.3 405.3 0 14.7-0.9 29.5-2.8 46.1l-2.9 20c-1.3 8.3-2.9 16.6-5 25.4l-4 15.8c-18.1 66.4-52.6 126.7-99.2 174.8l-11 10.9c-37.8 39.6-93.4 85.2-167.2 137.1-66.1 46.5-154.3 46.5-220.4 0-73.8-51.9-129.4-97.5-166-135.9-57.2-54.5-97.5-124.7-115.2-201.8l-3.1-14.2c-1.5-8.1-2.9-16.3-4-24.9l-0.6-3.8-2.1-20c-0.8-10-1.1-19.8-1.1-29.5 0-223.8 180-405.3 402.3-405.3z m0 73.1c-181.7 0-329.1 148.7-329.2 332.2 0 11.8 0.7 24 2.1 36.4l2.7 17.9c1.1 6.6 2.2 12.9 3.4 18.5l4.4 17.2c16.1 57.9 47.7 110.1 92.1 152.5 34 35.6 86.2 78.4 156.4 127.7 40.9 28.7 95.4 28.7 136.2 0.1 70.2-49.4 122.4-92.1 157.6-129 46.9-44.7 79.9-102.2 94.2-164.4l2.7-12.5 1.8-10.2 2.6-17.5c1.4-12.7 2.1-24.8 2.1-36.7 0-183.5-147.4-332.2-329.1-332.2z m0 182.9c87.5 0 158.5 70.9 158.5 158.4 0 87.5-70.9 158.5-158.5 158.5-87.5 0-158.5-71-158.5-158.5 0-87.5 70.9-158.5 158.5-158.4z m0 73.1c-47.1 0-85.3 38.2-85.4 85.3 0 47.1 38.2 85.3 85.4 85.4 47.1 0 85.3-38.2 85.3-85.4 0-47.1-38.2-85.3-85.3-85.3z"></path></svg>

          <span>Predeterminada</span>
        </div>

      </div>

      <div class="mt-8">
        <a
          (click)="editAddress()"
          class="cursor-pointer inline-block px-4 py-2 text-sm text-slate-700 border border-slate-700  bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          Modificar
        </a>
      </div>
    </section>
  `,
  styles: ``,
})
export class AddressComponent implements OnInit, OnDestroy {
  userData = signal<IUser | null>(null);
  private authSrv = inject(AuthService);
  private modalSrv = inject(ModalService);
  private router = inject(Router);

  private authSubscription!: Subscription;

  countries: {
    name: string;
    code: string;
    areaCode: string;
  }[] = [
    { name: 'Antigua y Barbuda', code: 'AG', areaCode: '+1' },
    { name: 'Argentina', code: 'AR', areaCode: '+54' },
    { name: 'Bahamas', code: 'BS', areaCode: '+1' },
    { name: 'Barbados', code: 'BB', areaCode: '+1' },
    { name: 'Belice', code: 'BZ', areaCode: '+501' },
    { name: 'Bolivia', code: 'BO', areaCode: '+591' },
    { name: 'Brasil', code: 'BR', areaCode: '+55' },
    { name: 'Canadá', code: 'CA', areaCode: '+1' },
    { name: 'Chile', code: 'CL', areaCode: '+56' },
    { name: 'Colombia', code: 'CO', areaCode: '+57' },
    { name: 'Costa Rica', code: 'CR', areaCode: '+506' },
    { name: 'Cuba', code: 'CU', areaCode: '+53' },
    { name: 'Dominica', code: 'DM', areaCode: '+1' },
    { name: 'Ecuador', code: 'EC', areaCode: '+593' },
    { name: 'El Salvador', code: 'SV', areaCode: '+503' },
    { name: 'Estados Unidos', code: 'US', areaCode: '+1' },
    { name: 'Granada', code: 'GD', areaCode: '+1' },
    { name: 'Guatemala', code: 'GT', areaCode: '+502' },
    { name: 'Guyana', code: 'GY', areaCode: '+592' },
    { name: 'Haití', code: 'HT', areaCode: '+509' },
    { name: 'Honduras', code: 'HN', areaCode: '+504' },
    { name: 'Jamaica', code: 'JM', areaCode: '+1' },
    { name: 'México', code: 'MX', areaCode: '+52' },
    { name: 'Nicaragua', code: 'NI', areaCode: '+505' },
    { name: 'Panamá', code: 'PA', areaCode: '+507' },
    { name: 'Paraguay', code: 'PY', areaCode: '+595' },
    { name: 'Perú', code: 'PE', areaCode: '+51' },
    { name: 'República Dominicana', code: 'DO', areaCode: '+1' },
    { name: 'San Cristóbal y Nieves', code: 'KN', areaCode: '+1' },
    { name: 'San Vicente y las Granadinas', code: 'VC', areaCode: '+1' },
    { name: 'Santa Lucía', code: 'LC', areaCode: '+1' },
    { name: 'Surinam', code: 'SR', areaCode: '+597' },
    { name: 'Trinidad y Tobago', code: 'TT', areaCode: '+1' },
    { name: 'Uruguay', code: 'UY', areaCode: '+598' },
    { name: 'Venezuela', code: 'VE', areaCode: '+58' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userData.set(this.authSrv.retrieveUserData());

      this.authSubscription = this.authSrv.isLoggedIn.subscribe((loggedIn) => {
        if (loggedIn) {
          this.userData.set(this.authSrv.retrieveUserData());
        }else{
          this.router.navigateByUrl('/');
        }
      })
    }
  }

  editAddress() {
    this.modalSrv.showAddressModal(this.userData());
  }

  findAreaCodeByCountryCode(countryCode: string): string | undefined {
    return this.countries.find((country) => country.code === countryCode)
      ?.areaCode;
  }

  ngOnDestroy(): void {
      if(this.authSubscription){
        this.authSubscription.unsubscribe();
      }
  }
}
