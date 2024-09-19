import { Component, Inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ConfirmedValidator } from '../../validators/confirmed.validator';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/user.interface';
import { CartService } from '../../services/cart.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent implements OnDestroy {
  loginForm: FormGroup;
  registerForm: FormGroup;
  forgetPswForm: FormGroup;
  submitted = signal<boolean>(false);

  isLoginModal = signal<boolean>(true);
  isRegisterModal = signal<boolean>(false);
  isForgetPswModal = signal<boolean>(false);

  showCurrentError: string = '';

  loginError = signal<boolean>(false);
  registerError = signal<boolean>(false);
  forgetPswError = signal<boolean>(false);

  modalLoading = signal<boolean>(false);

  private defaultDeley: number = 500;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private authService: AuthService,
    private cartSrv: CartService,
    private navigationSrv: NavigationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });

    this.forgetPswForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });

    this.registerForm.get('phone')?.updateValueAndValidity();
    
    // this.registerForm = this.formBuilder.group(
    //   {
    //     name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
    //     lastName: [
    //       '',
    //       [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)],
    //     ],
    //     email: ['', [Validators.required, Validators.email]],
    //     phone: ['', [Validators.required, this.phoneValidator]], // Validators.pattern(/^[0-9]{10}$/)
    //     password: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(6),
    //         Validators.maxLength(20),
    //       ],
    //     ],
    //     confirmPassword: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(6),
    //         Validators.maxLength(20),
    //       ],
    //     ],
    //   },
    //   {
    //     validator: ConfirmedValidator('password', 'confirmPassword'),
    //   },
    // );
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('overflow-hidden', true);
    }
  }

  toggleForm(form: string): void {
    this.modalLoading.set(false);
    this.submitted.set(false);
    this.loginForm.reset();
    this.registerForm.reset();

    this.loginError.set(false);
    this.registerError.set(false);
    this.forgetPswError.set(false);

    if (form === 'login') {
      this.isRegisterModal.set(false);
      this.isForgetPswModal.set(false);

      this.isLoginModal.set(true);
    } else if (form === 'register') {
      this.isLoginModal.set(false);
      this.isForgetPswModal.set(false);

      this.isRegisterModal.set(true);
    } else if (form === 'forgetPsw') {
      this.isLoginModal.set(false);
      this.isRegisterModal.set(false);

      this.isForgetPswModal.set(true);
    }
  }

  showErrorMessage(message: string) {
    this.showCurrentError = message;
    setTimeout(() => {
      this.loginError.set(false);
      this.registerError.set(false);
      this.forgetPswError.set(false);
    }, 5000);
  }

  login(): void {
    if (this.modalLoading()) return;

    this.submitted.set(true);

    if (!this.loginForm.valid) {
      // this.loginError = true;
      // this.showErrorMessage("Formulario inválido.")
      return;
    }

    this.modalLoading.set(true);

    //Deshabilitar inputs
    this.loginForm.get('email')?.disable();
    this.loginForm.get('password')?.disable();

    this.modalService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          // Habilitar inputs nuevamente
          this.loginForm.get('email')?.enable();
          this.loginForm.get('password')?.enable();
        }),
      )
      .subscribe({
        next: (user: IUser) => {
          this.cartSrv.saveLocalItems(user.cart);
          this.cartSrv.notifyCart(user.cart);

          setTimeout(() => {
            // Manejar la respuesta exitosa
            this.loginError.set(false);
            this.authService.login(user);
            this.modalLoading.set(false);
            this.closeModal();

            this.navigationSrv.navigate('/');
          }, this.defaultDeley);
        },
        error: (err: any) => {
          setTimeout(() => {
            // Manejar errores de la respuesta
            this.loginError.set(true);
            // this.submitted  = false;
            this.loginForm.get('password')?.setValue('');
            this.modalLoading.set(false);

            const { statusCode, message } = err.error;
            if (!statusCode || !message) {
              this.showErrorMessage(
                'Se ha producido un error inesperado del servidor.',
              );
              return;
            }

            if (message === 'USER_NOT_FOUND') {
              this.showErrorMessage(
                'Email no encontrado. Verifica si el usuario existe.',
              );
            } else if (message === 'INCORRECT_PASSWORD') {
              this.showErrorMessage('Contraseña incorrecta.');
            } else {
              this.showErrorMessage(
                'Se ha producido un error inesperado del servidor.',
              );
            }
          }, this.defaultDeley);
        },
      });
  }

  register(): void {
    if (this.modalLoading()) return;

    this.submitted.set(true);

    if (!this.registerForm.valid) {
      // this.registerError = true;
      // this.showErrorMessage("Formulario inválido.");
      return;
    }

    this.modalLoading.set(true);

    //Deshabilitar inputs
    this.registerForm.get('name')?.disable();
    this.registerForm.get('lastName')?.disable();
    this.registerForm.get('email')?.disable();
    this.registerForm.get('phone')?.disable();
    this.registerForm.get('password')?.disable();
    this.registerForm.get('confirmPassword')?.disable();

    this.modalService
      .register(this.registerForm.value)
      .pipe(
        finalize(() => {
          // Habilitar inputs nuevamente
          this.registerForm.get('name')?.enable();
          this.registerForm.get('lastName')?.enable();
          this.registerForm.get('email')?.enable();
          this.registerForm.get('phone')?.enable();
          this.registerForm.get('password')?.enable();
          this.registerForm.get('confirmPassword')?.enable();
        }),
      )
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            // Manejar la respuesta exitosa
            this.registerError.set(false);
            // this.authService.login(this.registerForm.value);
            this.authService.login(response);
            this.modalLoading.set(false);
            this.closeModal();
          }, this.defaultDeley);
        },
        error: (err: any) => {
          setTimeout(() => {
            // Manejar errores de la respuesta
            // this.submitted  = false;
            this.registerForm.get('password')?.setValue('');
            this.registerForm.get('confirmPassword')?.setValue('');
            this.registerError.set(true);
            this.modalLoading.set(false);

            const { statusCode, message } = err.error;
            if (!statusCode || !message) {
              this.showErrorMessage(
                'Se ha producido un error inesperado del servidor.',
              );
              return;
            }

            if (message === 'USER_EXITS') {
              this.showErrorMessage(
                'El correo electrónico ya está registrado.',
              );
            } else {
              this.showErrorMessage(
                'Se ha producido un error inesperado del servidor.',
              );
            }
          }, this.defaultDeley);
        },
      });
  }

  forgetPsw(): void {
    if (this.modalLoading()) return;

    this.submitted.set(true);

    if (!this.forgetPswForm.valid) {
      // this.forgetPswError = true;
      // this.showErrorMessage("Formulario inválido.");
      return;
    }

    this.modalLoading.set(true);

    //Deshabilitar inputs
    this.forgetPswForm.get('email')?.disable();

    this.modalService
      .forgetPassword(this.forgetPswForm.value.email)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            // Habilitar inputs nuevamente
            this.forgetPswForm.get('email')?.enable();
            this.modalLoading.set(false);
          }, this.defaultDeley);
        }),
      )
      .subscribe({
        next: (response) => {
          // Manejar la respuesta exitosa
          this.forgetPswError.set(false);
        },
        error: (err: any) => {
          // Manejar errores de la respuesta
          // this.submitted  = false;
          this.forgetPswError.set(true);

          const { statusCode, message } = err.error;
          if (!statusCode || !message) {
            this.showErrorMessage(
              'Se ha producido un error inesperado del servidor.',
            );
            return;
          }

          if (message === 'USER_NOT_FOUND') {
            this.showErrorMessage(
              'No se encontró ninguna cuenta con este correo.',
            );
          } else {
            this.showErrorMessage(
              'Se ha producido un error inesperado del servidor.',
            );
          }
        },
      });
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
    const control = this.registerForm.get('phone');
    if (control) {
      control.markAsTouched(); 
      control.updateValueAndValidity();
    }
  }

  closeModal(): void {
    this.submitted.set(false);

    this.loginForm.reset();
    this.registerForm.reset();
    this.forgetPswForm.reset();

    this.loginError.set(false);
    this.registerError.set(false);
    this.forgetPswError.set(false);

    this.isRegisterModal.set(false);
    this.isForgetPswModal.set(false);
    this.modalService.hideModal();

    document.body.classList.toggle('overflow-hidden', false);
  }

  ngOnDestroy(): void {
    document.body.classList.toggle('overflow-hidden', false);
    // Asegurarse de desuscribirse al destruir el componente
  }
}
