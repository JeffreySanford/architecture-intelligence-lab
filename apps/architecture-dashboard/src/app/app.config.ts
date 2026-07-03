import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideApi } from '@generated/spring-api-client';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { getRuntimeConfig } from './core/config/runtime-config';

const runtimeConfig = getRuntimeConfig();

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    provideNoopAnimations(),
    providePrimeNG({
      license: runtimeConfig.primeuiLicense,
      theme: {
        preset: Aura,
      },
    }),
    provideApi(''),
  ],
};
