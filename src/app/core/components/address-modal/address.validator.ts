import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para número de teléfono
export function noLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = /[a-zA-Z]/.test(control.value);
    return forbidden ? { 'noLetters': { value: control.value } } : null;
  };
}

export function addressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasLetter = /[a-zA-Z]/.test(control.value);
      const hasNumber = /\d/.test(control.value);
      const hasSpace = /\s/.test(control.value);
      const isValid = hasLetter && hasNumber && hasSpace;
      
      return isValid ? null : { 'addressInvalid': true };
    };
  }