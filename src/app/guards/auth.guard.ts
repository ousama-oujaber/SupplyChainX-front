import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

/**
 * Authentication guard that ensures user is logged in.
 * If Keycloak is not available, redirects to login page.
 */
export const authGuard: CanActivateFn = async () => {
    const keycloak = inject(KeycloakService);
    const router = inject(Router);

    try {
        const isLoggedIn = await keycloak.isLoggedIn();

        if (!isLoggedIn) {
            // Redirect to login page (which will trigger Keycloak login)
            router.navigate(['/login']);
            return false;
        }

        return true;
    } catch (error) {
        console.warn('Auth guard: Keycloak not available, redirecting to login page');
        router.navigate(['/login']);
        return false;
    }
};

