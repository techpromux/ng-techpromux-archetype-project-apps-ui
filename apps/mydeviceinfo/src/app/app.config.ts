import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

import { IconSetService } from '@coreui/icons-angular';
import { appRoutes } from './app.routes';
import { APP_VERSION } from './config/app.vars';
import { appVersion } from './config/app.version';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(
      BackButtonDisableModule.forRoot({
        preserveScroll: true,
      })
    ),
    IconSetService,
    provideAnimationsAsync(),
    //-----------------------------------------
    {
      provide: APP_VERSION,
      useValue: appVersion,
    },
  ],
};
