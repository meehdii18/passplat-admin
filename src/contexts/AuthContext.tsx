import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types/auth.types';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            try {
                const userData = JSON.parse(atob(token));
                setUser(userData);
                setIsAuthenticated(true);
                authService.setToken(token);
            } catch (error) {
                console.error('Token invalide:', error);
                authService.logout();
            }
        }
    }, []);

    const login = (token: string) => {
      try {
          const decodedToken = JSON.parse(atob(token));
          setUser(decodedToken);
          localStorage.setItem('token', token);
          setIsAuthenticated(true);
      } catch (error) {
          console.error('Erreur de décodage du token:', error);
      }
  };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};