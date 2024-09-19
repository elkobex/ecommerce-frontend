import { Component } from '@angular/core';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [],
  template: `
    <!-- return-policy.component.html -->
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-6">
        Políticas de Devoluciones
      </h1>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">
            Psycho Bunny
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Políticas de devolución y reembolso.
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Alcance de la política
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Las devoluciones son aplicables dentro de los 30 días
                posteriores a la recepción del producto.
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Condiciones para la devolución
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Los artículos deben estar sin usar, en el mismo estado en que se
                recibieron y en su empaque original.
              </dd>
            </div>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Proceso de devolución
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Para iniciar una devolución, debe contactarnos a través de
                nuestro formulario de contacto con su número de pedido y
                detalles del producto.
              </dd>
            </div>
            <!-- Agrega más secciones según sea necesario -->
          </dl>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ReturnsComponent {}
