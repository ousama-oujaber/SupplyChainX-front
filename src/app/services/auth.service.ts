import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UserProfile, Role, ROLES } from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private keycloak = inject(KeycloakService);

    private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    // Observable of the current user profile
    readonly userProfile$: Observable<UserProfile | null> = this.userProfileSubject.asObservable();

    // Observable of authentication state
    readonly isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    constructor() {
        this.loadUserProfile();
    }

    private async loadUserProfile(): Promise<void> {
        try {
            const isLoggedIn = await this.keycloak.isLoggedIn();
            this.isAuthenticatedSubject.next(isLoggedIn);

            if (isLoggedIn) {
                const profile = await this.keycloak.loadUserProfile();
                const roles = this.keycloak.getUserRoles();

                const userProfile: UserProfile = {
                    username: profile.username || '',
                    email: profile.email || '',
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    roles: roles as Role[]
                };

                this.userProfileSubject.next(userProfile);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.isAuthenticatedSubject.next(false);
            this.userProfileSubject.next(null);
        }
    }


    login(): void {
        this.keycloak.login();
    }

    logout(): void {
        this.keycloak.logout(window.location.origin);
    }

    async getToken(): Promise<string> {
        return await this.keycloak.getToken();
    }

    async isAuthenticated(): Promise<boolean> {
        return await this.keycloak.isLoggedIn();
    }

    getUserProfile(): UserProfile | null {
        return this.userProfileSubject.value;
    }

    getDisplayName(): string {
        const profile = this.userProfileSubject.value;
        if (!profile) return 'Guest';

        if (profile.firstName && profile.lastName) {
            return `${profile.firstName} ${profile.lastName}`;
        }
        return profile.username;
    }

    getInitials(): string {
        const profile = this.userProfileSubject.value;
        if (!profile) return '?';

        if (profile.firstName && profile.lastName) {
            return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
        }
        return profile.username.substring(0, 2).toUpperCase();
    }

    getRoles(): Role[] {
        return this.keycloak.getUserRoles() as Role[];
    }

    hasRole(role: Role | string): boolean {
        const roles = this.getRoles();
        return roles.includes(role as Role);
    }

    hasAnyRole(roles: (Role | string)[]): boolean {
        return roles.some(role => this.hasRole(role));
    }

    isAdmin(): boolean {
        return this.hasRole(ROLES.ADMIN);
    }

    hasProcurementAccess(): boolean {
        return this.hasAnyRole([
            ROLES.ADMIN,
            ROLES.GESTIONNAIRE_APPROVISIONNEMENT,
            ROLES.RESPONSABLE_ACHATS
        ]);
    }

    hasProductionAccess(): boolean {
        return this.hasAnyRole([
            ROLES.ADMIN,
            ROLES.CHEF_PRODUCTION,
            ROLES.PLANIFICATEUR,
            ROLES.SUPERVISEUR_PRODUCTION
        ]);
    }

    hasDeliveryAccess(): boolean {
        return this.hasAnyRole([
            ROLES.ADMIN,
            ROLES.GESTIONNAIRE_COMMERCIAL,
            ROLES.RESPONSABLE_LOGISTIQUE,
            ROLES.SUPERVISEUR_LIVRAISONS,
            ROLES.SUPERVISEUR_LOGISTIQUE
        ]);
    }
}
