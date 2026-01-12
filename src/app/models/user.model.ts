export interface User {
    idUser?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roles?: string[];
}
