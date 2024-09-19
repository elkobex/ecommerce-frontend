import { Component } from '@angular/core';

@Component({
  selector: 'app-privacity',
  standalone: true,
  imports: [],
  template: `
    <!-- privacy-policy.component.html -->
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-6">
        Política de Privacidad
      </h1>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">
            Psycho Bunny
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Nuestro compromiso con la seguridad y privacidad de tus datos.
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Recopilación de Datos
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Descripción de los tipos de datos que recopilamos, incluyendo
                información personal y datos de uso.
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Uso de la Información
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Cómo utilizamos la información recopilada para mejorar nuestros
                servicios y la experiencia del usuario.
              </dd>
            </div>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Compartir Información
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Con quién y bajo qué circunstancias podemos compartir tus datos.
              </dd>
            </div>

            <!-- Sección de Seguridad de la Información -->
            <section
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Seguridad de la Información
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Tomamos medidas razonables para proteger su información personal
                contra pérdida, robo y uso indebido, así como contra acceso no
                autorizado, divulgación, alteración y destrucción.
              </dd>
            </section>

            <!-- Sección de Cambios en la Declaración de Privacidad -->
            <section
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Cambios en la Declaración de Privacidad
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Podemos actualizar esta Declaración de Privacidad para reflejar
                cambios en nuestras prácticas de información. Si realizamos
                cambios significativos, le notificaremos mediante una
                notificación en nuestro sitio web o por otros medios, como el
                correo electrónico.
              </dd>
            </section>

            <!-- Sección de Contacto -->
            <section
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Contacto</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Si tiene alguna pregunta o inquietud sobre nuestra Declaración
                de Privacidad o nuestras prácticas de datos, no dude en
                contactarnos a través de los canales proporcionados en nuestro
                sitio web.
              </dd>
            </section>

            <!-- Sección de Derechos y Opciones -->
            <section
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Derechos y Opciones
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Usted tiene derecho a acceder, actualizar o eliminar la
                información que tenemos sobre usted. También puede optar por no
                recibir comunicaciones de marketing directo o solicitar que
                restrinjamos el procesamiento de su información personal.
              </dd>
            </section>
          </dl>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class PrivacityComponent {}
