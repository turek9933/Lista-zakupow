import { useState, createContext, ReactNode, useContext, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { loginUser, logoutUser, registerUser } from '@/src/api/authApi';

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null >(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await loginUser(email, password);
            setUser(auth.currentUser);
            return true;
        } catch (error) {
            console.error('[AuthContext] Błąd logowania:', error);
            return false;
        }
        finally {
            console.log('[AuthContext] Current user:', auth.currentUser);
            console.log('[AuthContext] Current user (state):', user);
        }
    };
    const logout = () => {
        logoutUser();
        setUser(null);
    };
    const register = async (email: string, password: string): Promise<boolean> => {
        try {
            await registerUser(email, password);
            return true;
        } catch (error) {
            console.error('[AuthContext] Błąd rejestracji:', error);
            return false;
        }
        finally {
            console.log('[AuthContext] Current user:', auth.currentUser);
            console.log('[AuthContext] Current user (state):', user);
        }
    }
    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuthContext() {
    return useContext(AuthContext);
}