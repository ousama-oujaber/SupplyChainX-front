/**
 * Role constants matching the backend Keycloak configuration.
 * Based on API_DOCUMENTATION.md role-based access matrix.
 */
export const ROLES = {
    // Admin - Full access to all modules
    ADMIN: 'ADMIN',

    // Procurement Module Roles
    GESTIONNAIRE_APPROVISIONNEMENT: 'GESTIONNAIRE_APPROVISIONNEMENT',
    RESPONSABLE_ACHATS: 'RESPONSABLE_ACHATS',

    // Production Module Roles
    CHEF_PRODUCTION: 'CHEF_PRODUCTION',
    PLANIFICATEUR: 'PLANIFICATEUR',
    SUPERVISEUR_PRODUCTION: 'SUPERVISEUR_PRODUCTION',

    // Delivery Module Roles
    GESTIONNAIRE_COMMERCIAL: 'GESTIONNAIRE_COMMERCIAL',
    RESPONSABLE_LOGISTIQUE: 'RESPONSABLE_LOGISTIQUE',
    SUPERVISEUR_LIVRAISONS: 'SUPERVISEUR_LIVRAISONS',
    SUPERVISEUR_LOGISTIQUE: 'SUPERVISEUR_LOGISTIQUE'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Role groups for module access control
 */
export const ROLE_GROUPS = {
    PROCUREMENT: [
        ROLES.ADMIN,
        ROLES.GESTIONNAIRE_APPROVISIONNEMENT,
        ROLES.RESPONSABLE_ACHATS
    ],
    PRODUCTION: [
        ROLES.ADMIN,
        ROLES.CHEF_PRODUCTION,
        ROLES.PLANIFICATEUR,
        ROLES.SUPERVISEUR_PRODUCTION
    ],
    DELIVERY: [
        ROLES.ADMIN,
        ROLES.GESTIONNAIRE_COMMERCIAL,
        ROLES.RESPONSABLE_LOGISTIQUE,
        ROLES.SUPERVISEUR_LIVRAISONS,
        ROLES.SUPERVISEUR_LOGISTIQUE
    ],
    USER_MANAGEMENT: [
        ROLES.ADMIN
    ]
} as const;

/**
 * User profile interface for authenticated users
 */
export interface UserProfile {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: Role[];
}
