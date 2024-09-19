import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {

  //withViewTransitions(),

  providers: [
    provideRouter(
      routes, 
      withComponentInputBinding(),
      // withInMemoryScrolling({
      //   scrollPositionRestoration: 'enabled',
      //   anchorScrolling: 'enabled' // Agrega esta línea
      // }),
      // withViewTransitions()
      
    ),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([])),
    provideAnimations(),
  ],
};
