export interface User {
    id: number;
    mail: string;
    username: string;
    role: number;
    tel?: string;
    adresse?: string;
    nom?: string;
    prenom?: string;
    nbProlong?: number;
    estSupprime?: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}