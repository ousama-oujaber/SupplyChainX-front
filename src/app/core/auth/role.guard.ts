import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../../shared/models/auth.models';

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

