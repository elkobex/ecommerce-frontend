import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  template: `
    <section
      id="notifications"
      class="flex flex-col items-center justify-center h-full p-5 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-28 w-28 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5.121 11.121a1.5 1.5 0 112.122-2.122 1.5 1.5 0 01-2.122 2.122zM11 12a2 2 0 100-4 2 2 0 000 4zm6.364-6.364a1.5 1.5 0 11-2.122 2.122 1.5 1.5 0 012.122-2.122z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.5a2 2 0 01-2.828 0l-4.243-4.243a2 2 0 112.828-2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414a2 2 0 112.828 2.828z"
        />
      </svg>
      <span class="text-lg text-gray-600 font-semibold"
        >Lista de Notificaciones Vacía</span
      >
      <p class="text-gray-500">No tienes ninguna notificación pendiente.</p>
      <p class="text-sm text-gray-400 mt-2">¡Estás al día! 😊</p>
    </section>
  `,
  styles: ``,
})
export class NotificationsComponent {}
