import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UserProfile, Role, ROLES } from '../../shared/models/auth.models';

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

    /**
     * Login with username and password using Keycloak Direct Access Grants
     * @param username User's username
     * @param password User's password
     * @returns Promise that resolves on successful login
     */
    async loginWithCredentials(username: string, password: string): Promise<void> {
        try {
            // Get Keycloak instance
            const keycloakInstance = this.keycloak.getKeycloakInstance();

            // Keycloak token endpoint URL
            const tokenUrl = `${keycloakInstance.authServerUrl}/realms/${keycloakInstance.realm}/protocol/openid-connect/token`;

            // Prepare form data for token request
            const formData = new URLSearchParams();
            formData.append('grant_type', 'password');
            formData.append('client_id', keycloakInstance.clientId || '');
            formData.append('username', username);
            formData.append('password', password);

            // Make token request
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error: any = new Error(errorData.error_description || 'Authentication failed');
                error.status = response.status;
                error.data = errorData;
                throw error;
            }

            const tokenData = await response.json();

            // Set tokens directly on the Keycloak instance
            // This avoids calling init() again which causes CORS issues
            keycloakInstance.token = tokenData.access_token;
            keycloakInstance.refreshToken = tokenData.refresh_token;
            keycloakInstance.idToken = tokenData.id_token;
            keycloakInstance.timeSkew = 0;

            // Parse the token to get expiration time
            if (tokenData.expires_in) {
                keycloakInstance.tokenParsed = this.parseJwt(tokenData.access_token);
                keycloakInstance.refreshTokenParsed = this.parseJwt(tokenData.refresh_token);
                keycloakInstance.idTokenParsed = this.parseJwt(tokenData.id_token);
            }

            // Mark as authenticated
            keycloakInstance.authenticated = true;

            // Load user profile and update state
            await this.loadUserProfile();

        } catch (error: any) {
            console.error('Login with credentials failed:', error);
            throw error;
        }
    }

    /**
     * Parse JWT token  
     */
    private parseJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
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
