import { Component } from '@angular/core';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [],
  template: `<!-- shipping-policy.component.html -->
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-6">
        Política de Envío y Entrega
      </h1>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">
          Psycho Bunny
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Información sobre nuestra política de envío y entrega.
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Opciones de Envío
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Ofrecemos varias opciones de envío, incluyendo estándar, exprés
                e internacional. Los costos y tiempos de entrega varían según el
                destino y el método seleccionado.
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Tiempo de Procesamiento
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                El tiempo de procesamiento de pedidos es de 1-2 días hábiles.
                Los pedidos realizados después de las 12 p.m. se procesarán el
                siguiente día hábil.
              </dd>
            </div>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Seguimiento de Envíos
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Proporcionamos un número de seguimiento para todos los pedidos.
                Puede rastrear su paquete a través de nuestro sitio web o la
                página del transportista.
              </dd>
            </div>
            <!-- Agrega más secciones según sea necesario -->
          </dl>
        </div>
      </div>
    </div> `,
  styles: ``,
})
export class ShippingComponent {}
