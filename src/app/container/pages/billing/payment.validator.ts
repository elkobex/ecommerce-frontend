import { ElementRef } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export class PaymentValidator {
  private paymentForm!: FormGroup;

  constructor(payForm: FormGroup) {
    this.paymentForm = payForm;
  }

  /* CARDNUMBER VALIDATORS */
  formatCardNumber(event: Event): void {
    if(event){
      const inputElement = event.target as HTMLInputElement;
      if (inputElement) {
        let value = inputElement.value;
        if (value) {
          // Elimina cualquier carácter que no sea un dígito
          value = value.replace(/\D/g, '');
          // Limita la longitud a 16 dígitos
          value = value.substring(0, 16);
          // Agrega un espacio cada 4 dígitos
          value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        // Actualiza el valor del input sin disparar nuevos eventos de cambio
        this.paymentForm.get('newNumbk')?.setValue(value, { emitEvent: false });
      }
    }
  }

  cardValidator(control: FormControl): ValidationErrors | null {
    // Verifica si el control tiene un valor y si ha perdido el foco
    if (control.value && control.touched) {
      const sanitizedNumber = control.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
      if (sanitizedNumber.length < 16) {
        return { requiredLength: true }; // Retorna un objeto de error si la longitud es menor a 16
      }
      if (!this.isValidCardNumber(sanitizedNumber)) {
        return { invalidCard: true }; // Retorna un objeto de error si la tarjeta no es válida
      }
    }
    return null; // No retorna ningún error si aún no se han ingresado todos los dígitos
  }

  isValidCardNumber(number: string): boolean {
    const sanitizedNumber = number.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (sanitizedNumber.length !== 16) {
      return false; // El número de tarjeta debe tener 16 dígitos
    }

    // Implementación del algoritmo de Luhn
    let sum = 0;
    for (let i = 0; i < sanitizedNumber.length; i++) {
      let digit = parseInt(sanitizedNumber.charAt(i), 10);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }

  onCardNumberBlur(): void {
    const control = this.paymentForm.get('newNumbk');
    if (control) {
      control.markAsTouched(); // Marca el control como tocado para activar la validación
      control.updateValueAndValidity(); // Actualiza la validez del control
    }
  }

  /* EXPIRATION VALIDATORS */
  formatExpirationDate(event: Event): string | void {
    if(event){
      const inputElement = event.target as HTMLInputElement;
      if (inputElement) {
        let value = inputElement.value;
        // Asegúrate de que el valor tenga exactamente 4 dígitos antes de agregar el '/'
        if (value && value.replace(/\D/g, '').length === 4) {
          value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
          this.paymentForm.get('newExk')?.setValue(value, { emitEvent: false });
        }
      }
    }
  }

  expirationValidator(control: FormControl): ValidationErrors | null {
    const value = control.value || '';

    const sanitizedValue = value.replace(/\D/g, '');
    if (sanitizedValue.length !== 4) {
      return { requiredLength: true }; // Error si no hay exactamente 4 dígitos
    }

    const [month, year] = sanitizedValue.match(/(\d{2})(\d{2})/).slice(1);
    if (!this.isValidExpirationDate(month, '20' + year)) {
      return { invalidCard: true }; // Error si la fecha no es válida
    }

    return null; // No hay error si la fecha es válida
  }

  isValidExpirationDate(month: string, year: string): boolean {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0 (enero = 0, febrero = 1, etc.)

    const inputYear = parseInt(year, 10);
    const inputMonth = parseInt(month, 10);

    // Calcula la fecha máxima permitida (agregando 10 años al año actual)
    const maxAllowedYear = currentYear + 10;

    // Verifica si el año y el mes están en el futuro y no exceden la fecha máxima permitida
    if (
      inputYear >= currentYear &&
      inputYear <= maxAllowedYear &&
      (inputYear > currentYear || inputMonth >= currentMonth)
    ) {
      return true; // La fecha de expiración es válida
    }

    return false; // La fecha de expiración está vencida o excede el límite permitido
  }

  onCardExpBlur(): void {
    const control = this.paymentForm.get('newExk');
    if (control) {
      control.markAsTouched(); // Marca el control como tocado para activar la validación
      control.updateValueAndValidity(); // Actualiza la validez del control
    }
  }

  /* CVV VALIDATORS */
  cvvValidator(control: FormControl): ValidationErrors | null {
    if (control.value && control.touched) {
      const sanitizedValue = control.value.replace(/\D/g, '');
      if (sanitizedValue.length !== 3) {
        return { requiredLength: true }; // Error si no hay exactamente 3 dígitos
      }

      // Verifica si todos los dígitos son iguales
      if (/^(\d)\1+$/.test(sanitizedValue)) {
        return { sameDigits: true }; // Error si los dígitos son iguales
      }
    }

    return null; // No hay error si el CVV es válido
  }

  onCvvBlur(): void {
    const control = this.paymentForm.get('newCvk');
    if (control) {
      control.markAsTouched(); // Marca el control como tocado para activar la validación
      control.updateValueAndValidity(); // Actualiza la validez del control
    }
  }

  getCardType(number: string): string {
    if (number.startsWith('4')) {
      return 'Visa';
    } else if (number.startsWith('5')) {
      return 'Mastercard';
    } else if (number.startsWith('3')) {
      return 'American Express';
    } else {
      return 'Desconocida';
    }
  }
}