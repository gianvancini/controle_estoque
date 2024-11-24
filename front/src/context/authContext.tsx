import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, usuarioTipo: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiracao = localStorage.getItem('tokenExpiracao');

        if (token && expiracao) {
            const agora = new Date().getTime();
            if (agora < parseInt(expiracao)) {
                setIsAuthenticated(true);
            } else {
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, usuarioTipo: string) => {
        const expiracao = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem('token', token);
        localStorage.setItem('usuarioTipo', usuarioTipo);
        localStorage.setItem('tokenExpiracao', expiracao.toString());
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioTipo');
        localStorage.removeItem('tokenExpiracao');
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
