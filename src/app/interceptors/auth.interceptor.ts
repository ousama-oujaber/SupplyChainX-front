import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { from, switchMap, catchError, throwError, of } from 'rxjs';

/**
 * HTTP interceptor that adds the Keycloak JWT token to all API requests
 * and handles authentication errors (401, 403).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const keycloak = inject(KeycloakService);
    const router = inject(Router);

    // Skip adding token to Keycloak requests
    if (req.url.includes('/realms/')) {
        return next(req);
    }

    // Try to get token, but proceed without it if Keycloak is not initialized
    return from(
        keycloak.getToken().catch(() => null)
    ).pipe(
        switchMap(token => {
            if (token) {
                const authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next(authReq);
            }
            return next(req);
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Unauthorized - token expired or invalid
                console.warn('401 Unauthorized - redirecting to login');
                try {
                    keycloak.login();
                } catch {
                    router.navigate(['/login']);
                }
            } else if (error.status === 403) {
                // Forbidden - user doesn't have required permissions
                console.warn('403 Forbidden - redirecting to access denied');
                router.navigate(['/access-denied']);
            }
            return throwError(() => error);
        })
    );
};
