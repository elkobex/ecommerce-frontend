// : string
// formatCardNumber(event: Event): void {
//   const inputElement = event.target as HTMLInputElement;
//   if (inputElement) {
//     const value = inputElement.value;
//     const formattedValue = value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
//     this.paymentForm.get('newNumbk')?.setValue(formattedValue, { emitEvent: false });
//     this.paymentForm.get('newNumbk')?.updateValueAndValidity(); // Actualiza la vista
//   }
// }

// formatCardNumber(event: Event): void {
//   const inputElement = event.target as HTMLInputElement;
//   if (inputElement) {
//     let value = inputElement.value;
//     // Elimina cualquier carácter que no sea un dígito
//     value = value.replace(/\D/g, '');
//     // Limita la longitud a 16 dígitos
//     value = value.substring(0, 16);
//     // Agrega un espacio cada 4 dígitos
//     value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
//     // Actualiza el valor del input sin disparar nuevos eventos de cambio
//     this.paymentForm.get('newNumbk')?.setValue(value, { emitEvent: false });
//   }
// }

// cardValidator(control: FormControl): ValidationErrors | null {
//   if (this.isValidCardNumber(control.value)) {
//     return null; // No hay error
//   }
//   return { invalidCard: true }; // Retorna un objeto de error si la tarjeta no es válida
// }

// cardValidator(control: FormControl): ValidationErrors | null {
//   // Solo muestra el error si la longitud del valor es igual a 19 (16 dígitos más 3 espacios)
//   if (control.value && control.value.replace(/\s/g, '').length === 16) {
//     if (this.isValidCardNumber(control.value)) {
//       return null; // No hay error
//     }
//     return { invalidCard: true }; // Retorna un objeto de error si la tarjeta no es válida
//   }
//   return null; // No retorna ningún error si aún no se han ingresado todos los dígitos
// }

// formatExpirationDate(event: Event): string | void {
//   const inputElement = event.target as HTMLInputElement;
//   if (inputElement) {
//     let value = inputElement.value;
//     if (value) {
//       // Elimina cualquier carácter que no sea un dígito
//       value = value.replace(/\D/g, '');
//       // Limita la longitud a 4 dígitos
//       value = value.substring(0, 4);
//       // Agrega un / a cada 2 dígitos
//       value = value.replace(/(\d{2})(?=\d)/g, '$1/');
//     }

//     // Actualiza el valor del input sin disparar nuevos eventos de cambio
//     this.paymentForm.get('newExk')?.setValue(value, { emitEvent: false });
//   }
// }

// expirationValidator(control: FormControl): ValidationErrors | null {
//   if (control.value && control.touched) {
//     const sanitizedNumber = control.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
//     if (sanitizedNumber.length < 4) {
//       return { requiredLength: true }; // Retorna un objeto de error si la longitud es menor a 4
//     }

//     const [month, year] = control.value.split('/');

//     if (!month || !year || !this.isValidExpirationDate(month, year)) {
//       return { invalidCard: true }; // Retorna un objeto de error si la tarjeta no es válida
//     }
//   }

//   return null;
// }

// cvvValidator(control: FormControl): ValidationErrors | null {
//   const value = control.value;
//   if (value && value.length === 3 && new Set(value).size === 3) {
//     return null;
//   }
//   return { invalidCvv: true };
// }

// cvvValidator(control: FormControl): ValidationErrors | null {
//   const sanitizedValue = control.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
//   if (sanitizedValue.length !== 3) {
//     return { requiredLength: true }; // Error si no hay exactamente 3 dígitos
//   }

//   // Verifica si los dígitos son todos iguales
//   if (new Set(sanitizedValue).size === 1) {
//     return { sameDigits: true }; // Error si los dígitos son iguales
//   }

//   return null; // No hay error si el CVV es válido
// }