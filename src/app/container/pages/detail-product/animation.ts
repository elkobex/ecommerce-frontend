import { trigger, state, style, animate, transition } from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  // Estado 'next' para la siguiente imagen
  state('next', style({ transform: 'translateX(0)' })),
  // Estado 'prev' para la imagen anterior
  state('prev', style({ transform: 'translateX(0)' })),
  // Transición de derecha a izquierda cuando la imagen siguiente entra
  transition('* => next', [
    style({ transform: 'translateX(100%)' }),
    animate('0.5s ease-out')
  ]),
  // Transición de izquierda a derecha cuando la imagen anterior entra
  transition('* => prev', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.5s ease-out')
  ])
]);