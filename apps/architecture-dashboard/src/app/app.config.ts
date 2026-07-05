import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideApi as provideNestApi } from '@generated/nest-api-client';
import { provideApi as provideSpringApi } from '@generated/spring-api-client';
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
    provideAnimations(),
    providePrimeNG({
      license: runtimeConfig.primeuiLicense,
      theme: {
        preset: Aura,
      },
    }),
    provideSpringApi({ basePath: '', withCredentials: true }),
    provideNestApi({ basePath: '', withCredentials: true }),
  ],
};
