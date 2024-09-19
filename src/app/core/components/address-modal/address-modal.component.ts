import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { addressValidator, noLettersValidator } from './address.validator';
import { IAddress } from '../../interfaces/address.interface';

@Component({
  selector: 'app-address-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './address-modal.component.html',
  styleUrl: './address-modal.component.scss'
})
export class AddressModalComponent implements OnInit, OnDestroy{

  @Input({ required: true }) userData!: IUser | null;

  submitted = signal<boolean>(false);
  addressForm!: FormGroup;
  modalLoading = signal<boolean>(true);
  isError = signal<boolean>(false);
  currentCountryCode = signal<string>("MX");

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
    { name: 'Venezuela', code: 'VE', areaCode: '+58' }
  ];

  mexicanStates: {
    name: string;
    code: string;
  }[] = [
    { name: 'Aguascalientes', code: 'AG' },
    { name: 'Baja California', code: 'BC' },
    { name: 'Baja California Sur', code: 'BS' },
    { name: 'Campeche', code: 'CM' },
    { name: 'Chiapas', code: 'CS' },
    { name: 'Chihuahua', code: 'CH' },
    { name: 'Distrito Federal', code: 'DF' },
    { name: 'Coahuila de Zaragoza', code: 'CO' },
    { name: 'Colima', code: 'CL' },
    { name: 'Durango', code: 'DG' },
    { name: 'Estado de México', code: 'EM' },
    { name: 'Guanajuato', code: 'GT' },
    { name: 'Guerrero', code: 'GR' },
    { name: 'Hidalgo', code: 'HG' },
    { name: 'Jalisco', code: 'JA' },
    { name: 'Michoacán de Ocampo', code: 'MI' },
    { name: 'Morelos', code: 'MO' },
    { name: 'Nayarit', code: 'NA' },
    { name: 'Nuevo León', code: 'NL' },
    { name: 'Oaxaca', code: 'OA' },
    { name: 'Puebla', code: 'PU' },
    { name: 'Querétaro', code: 'QT' },
    { name: 'Quintana Roo', code: 'QR' },
    { name: 'San Luis Potosí', code: 'SL' },
    { name: 'Sinaloa', code: 'SI' },
    { name: 'Sonora', code: 'SO' },
    { name: 'Tabasco', code: 'TB' },
    { name: 'Tamaulipas', code: 'TM' },
    { name: 'Tlaxcala', code: 'TL' },
    { name: 'Veracruz de Ignacio de la Llave', code: 'VE' },
    { name: 'Yucatán', code: 'YU' },
    { name: 'Zacatecas', code: 'ZA' }
  ];

  usaStates: {
    name: string;
    code: string;
  }[] = [
    { name: 'Alabama', code: 'AL' },
    { name: 'Alaska', code: 'AK' },
    { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' },
    { name: 'California', code: 'CA' },
    { name: 'Carolina del Norte', code: 'NC' },
    { name: 'Carolina del Sur', code: 'SC' },
    { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' },
    { name: 'Dakota del Norte', code: 'ND' },
    { name: 'Dakota del Sur', code: 'SD' },
    { name: 'Delaware', code: 'DE' },
    { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' },
    { name: 'Hawái', code: 'HI' },
    { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' },
    { name: 'Kentucky', code: 'KY' },
    { name: 'Luisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' },
    { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'Míchigan', code: 'MI' },
    { name: 'Minnesota', code: 'MN' },
    { name: 'Misisipi', code: 'MS' },
    { name: 'Misuri', code: 'MO' },
    { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' },
    { name: 'Nueva Jersey', code: 'NJ' },
    { name: 'Nueva York', code: 'NY' },
    { name: 'Nuevo Hampshire', code: 'NH' },
    { name: 'Nuevo México', code: 'NM' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregón', code: 'OR' },
    { name: 'Pensilvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' },
    { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' },
    { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' },
    { name: 'Virginia Occidental', code: 'WV' },
    { name: 'Washington', code: 'WA' },
    { name: 'Wisconsin', code: 'WI' },
    { name: 'Wyoming', code: 'WY' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private modalSrv: ModalService, private authSrv: AuthService) {
    
  }

  get addressFormCtrl() {
    return this.addressForm.controls;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      document.body.classList.toggle('overflow-hidden', true);

      if(this.userData && this.userData._id){
        this.setCurrentAdress();
      }else{
        this.authSrv.logout();
      }
    }
  }

  setCurrentAdress(){
    this.currentCountryCode.set(this.userData?.country.code || 'MX');

    this.addressForm = this.fb.group({
      fullName: [this.userData?.name ? this.userData?.name : '', [Validators.required, Validators.pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)]],
      // phoneNumber: [this.userData?.phone, [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
      // phoneNumber: [this.userData?.phone ? this.userData?.phone : '', [Validators.required, Validators.minLength(7), Validators.maxLength(11), noLettersValidator()]],
      phoneNumber: [this.formateNewNumber(this.userData?.phone), [Validators.required, this.phoneValidator]],
      country: [this.userData?.country.code ? this.userData?.country.code : 'MX', [Validators.required]],
      state: [this.userData?.state.code ? this.userData?.state.code : 'EM', [Validators.required]],
      city: [this.userData?.city ? this.userData?.city : '', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      zipCode: [this.userData?.zipCode ? this.userData?.zipCode : '', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      address: [this.userData?.address ? this.userData?.address : '', [Validators.required, addressValidator()]]
    });

    this.addressForm.get('phoneNumber')?.updateValueAndValidity();

    // setTimeout(() => {
    // }, 500);
    this.modalLoading.set(false);
  }

  formateNewNumber(number: string | undefined): string{
    if(!number){
      return '';
    }

    let value = number.replace(/\D/g, '');
    value = value.substring(0, 10);

    return value.replace(/(\d{3})(\d{3})(?=\d)/g, '$1 $2 ');
  }

  updateCountrySelect(currentCountry: string){
    if (this.userData && this.userData.country) {
      this.userData.country.code = currentCountry;

      this.currentCountryCode.set(currentCountry);

      if(currentCountry === "MX"){
        this.addressForm.get('state')?.setValue('EM');
      }else if(currentCountry === "US"){
        this.addressForm.get('state')?.setValue('AL');
      }else{
        this.addressForm.get('state')?.setValue('');
      }
    }
  }

  onSubmit() {
    if(this.modalLoading()) return;

    this.submitted.set(true);

    if (this.addressForm.valid) {
      this.modalLoading.set(true);

      const updateAddress: IAddress = {
        fullName: this.addressForm.value.fullName,
        phoneNumber: this.addressForm.value.phoneNumber,
        country: {code: this.getCountryByCode(this.addressForm.value.country)?.code || '', name: this.getCountryByCode(this.addressForm.value.country)?.name || ''},
        state: (this.currentCountryCode() === "MX" || this.currentCountryCode() === "US") ? {code: this.getStateByCode(this.addressForm.value.state)?.code || '', name: this.getStateByCode(this.addressForm.value.state)?.name || ''} : {code: this.abbreviateTwoWords(this.addressForm.value.state), name: this.addressForm.value.state},
        city: this.addressForm.value.city,
        zipCode: this.addressForm.value.zipCode,
        address: this.addressForm.value.address
      }
    
      if(this.userData && this.userData._id){
        this.authSrv.updateUserAddress(this.userData._id, updateAddress).subscribe((user: IUser) => {
          this.authSrv.login(user);

          setTimeout(() => {
            this.modalLoading.set(false);
            this.isError.set(false);
            this.closeModal();
          }, 1000);
        }, (error) => {
          this.modalLoading.set(false);
          this.isError.set(true);
        })
      }else{
        this.authSrv.logout();
      }
    } else {
      // // Identificar campos inválidos
      // const formControls = this.addressForm.controls;
      // for (const name in formControls) {
      //   if (formControls[name].invalid) {
      //     console.log("error => ", formControls[name]);
      //     console.log('Campo inválido:', name);
      //   }
      // }
    }
  }

  getCountryByCode(countryCode: string): {
    name: string;
    code: string;
    areaCode: string;
  } | undefined {
    return this.countries.find(country => country.code === countryCode);
  }


  getStateByCode(stateCode: string): {
    name: string;
    code: string;
  } | undefined {
    const allStates = this.usaStates.concat(this.mexicanStates);

    return allStates.find(state => state.code === stateCode);
  }

  abbreviateTwoWords(text: string): string {
    const words = text.trim().split(/\s+/);
  
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    } else if (words.length === 2) {
      const firstInitial = words[0][0].toUpperCase();
      const secondInitial = words[1][0].toUpperCase();
      // return `${firstInitial}.${secondInitial}`;
      return `${firstInitial}${secondInitial}`;
    } else {
      return words.slice(0, 2).join('').toUpperCase();
    }
  }

  formatPhoneNumber(event: Event): void {
    if (event) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement) {
        let value = inputElement.value;
        if (value) {
          // Elimina cualquier carácter que no sea un dígito
          value = value.replace(/\D/g, '');
          // Limita la longitud a 10 dígitos
          value = value.substring(0, 10);

          if(value.length < 8){
            value = value.replace(/(\d{3})(?=\d)/g, '$1 ');
          }else{
            value = value.replace(/(\d{3})(\d{3})(?=\d)/g, '$1 $2 ');
          }
        }
        // Actualiza el valor del input sin disparar nuevos eventos de cambio
        inputElement.value = value;
      }
    }
  }

  phoneValidator(control: FormControl): ValidationErrors | null {
    if (control.value && control.touched) {
      const sanitizedNumber = control.value.replace(/\D/g, ''); 
      if (sanitizedNumber.length !== 10) {
        return { requiredLength: true };
      }
    }
    return null;
  }

  onPhoneNumberBlur(): void {
    const control = this.addressForm.get('phoneNumber');
    if (control) {
      control.markAsTouched(); 
      control.updateValueAndValidity();
    }
  }
  
  closeModal(): void {
    this.isError.set(false);
    this.modalSrv.hideAddressModal();
    document.body.classList.toggle('overflow-hidden', false);
  }

  ngOnDestroy(): void {
    document.body.classList.toggle('overflow-hidden', false);
      // if(this.modalAddressSuscription){
      //   this.modalAddressSuscription.unsubscribe();
      // }
  }
}
