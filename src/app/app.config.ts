import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { KeycloakService } from 'keycloak-angular';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from '../environments/environment';
import { CustomerEffects } from './features/delivery/customers/store/customer.effects';
import { customerFeatureKey, customerReducer } from './features/delivery/customers/store/customer.reducer';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        enableLogging: !environment.production
      },
      loadUserProfileAtStartUp: true,
      enableBearerInterceptor: false // We use our custom interceptor
    }).catch((error) => {
      console.warn('Keycloak initialization failed. Running without authentication.', error);
      // Return resolved promise to allow app to continue loading
      return Promise.resolve(false);
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    MessageService,
    ConfirmationService,
    provideStore(),
    provideEffects(CustomerEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideState(customerFeatureKey, customerReducer)
  ]
};

