import axios from 'axios';
import { User } from '../types/auth.types';

interface LoginResponse {
    id: number;
    mail: string;
    username: string;
    role: number;
}

const BASE_URL = 'http://localhost:8080';

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${BASE_URL}/account/loginAdmin`, {
            email,
            password
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        // Supprimer le token des headers axios
        delete axios.defaults.headers.common['Authorization'];
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    setToken: (token: string): void => {
        localStorage.setItem('token', token);
        // Ajouter le token aux headers axios pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    isAdmin: (userData: User): boolean => {
        return userData && userData.role === 2;
    }
};