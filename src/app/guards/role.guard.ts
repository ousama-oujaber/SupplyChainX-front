import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.models';

/**
 * Factory function that creates a role-based guard.
 * Checks if the user has any of the required roles.
 *
 * @param allowedRoles Array of roles that are allowed to access the route
 * @returns CanActivateFn guard function
 *
 * @example
 * // In routes
 * {
 *   path: 'users',
 *   canActivate: [roleGuard(['ADMIN'])],
 *   component: UserListComponent
 * }
 */
export function roleGuard(allowedRoles: (Role | string)[]): CanActivateFn {
    return async () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        try {
            // Check if user is authenticated
            const isAuthenticated = await authService.isAuthenticated();
            if (!isAuthenticated) {
                router.navigate(['/login']);
                return false;
            }

            // Check if user has any of the allowed roles
            if (authService.hasAnyRole(allowedRoles)) {
                return true;
            }

            // User doesn't have required role - redirect to access denied
            console.warn('Access denied: User does not have required roles', allowedRoles);
            router.navigate(['/access-denied']);
            return false;
        } catch (error) {
            console.warn('Role guard: Error checking roles, redirecting to login');
            router.navigate(['/login']);
            return false;
        }
    };
}

/**
 * Guard for procurement module routes
 */
export const procurementGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    try {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
            router.navigate(['/login']);
            return false;
        }

        if (authService.hasProcurementAccess()) {
            return true;
        }

        router.navigate(['/access-denied']);
        return false;
    } catch (error) {
        console.warn('Procurement guard: Error, redirecting to login');
        router.navigate(['/login']);
        return false;
    }
};

/**
 * Guard for production module routes
 */
export const productionGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    try {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
            router.navigate(['/login']);
            return false;
        }

        if (authService.hasProductionAccess()) {
            return true;
        }

        router.navigate(['/access-denied']);
        return false;
    } catch (error) {
        console.warn('Production guard: Error, redirecting to login');
        router.navigate(['/login']);
        return false;
    }
};

/**
 * Guard for delivery module routes
 */
export const deliveryGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    try {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
            router.navigate(['/login']);
            return false;
        }

        if (authService.hasDeliveryAccess()) {
            return true;
        }

        router.navigate(['/access-denied']);
        return false;
    } catch (error) {
        console.warn('Delivery guard: Error, redirecting to login');
        router.navigate(['/login']);
        return false;
    }
};

/**
 * Guard for admin-only routes (e.g., user management)
 */
export const adminGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    try {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
            router.navigate(['/login']);
            return false;
        }

        if (authService.isAdmin()) {
            return true;
        }

        router.navigate(['/access-denied']);
        return false;
    } catch (error) {
        console.warn('Admin guard: Error, redirecting to login');
        router.navigate(['/login']);
        return false;
    }
};

