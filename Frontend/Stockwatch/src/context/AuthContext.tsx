import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { fetchCurrentUser } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCurrentUser();

            if (data.authenticated) {
                setUser({
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    picture: data.picture,
                    authenticated: true,
                });
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
            setError('Failed to check authentication');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        window.location.href = 'http://localhost:8080/api/auth/logout';
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
