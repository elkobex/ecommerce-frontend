import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  template: `
  <!-- contact.component.html -->
<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold text-center mb-6">Contacto</h1>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h2 class="text-lg leading-6 font-medium text-gray-900">Psycho Bunny</h2>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Ponte en contacto con nosotros.</p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Atención al Cliente</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Para preguntas sobre pedidos, productos o políticas, por favor contacta a nuestro equipo de atención al cliente.
          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Correo Electrónico</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Puedes enviarnos un correo electrónico a: {{email}}
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Teléfono</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Llámanos al: +52 (493) 123-4567
          </dd>
        </div>
        <!-- Agrega más secciones según sea necesario -->
      </dl>
    </div>
  </div>
</div>

  `,
  styles: ``
})
export class ContactComponent {
  email: string = "contacto@bunnybunny.com";
}
