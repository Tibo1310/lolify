import React, { createContext, useContext, useState, useEffect } from 'react';
// Nous importerons useMeLazyQuery une fois qu'il sera généré
// import { useMeLazyQuery } from '../apollo/generated';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // Nous utiliserons cette query une fois générée
  // const [getMe] = useMeLazyQuery();

  useEffect(() => {
    // Vérifier le token stocké au chargement
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Simulation en attendant la génération du code
          // const { data } = await getMe();
          
          // if (data?.me) {
          //   setUser(data.me);
          // } else {
          //   // Si l'API retourne null, le token n'est plus valide
          //   localStorage.removeItem('token');
          // }
        } catch (error) {
          console.error("Erreur lors de la vérification de l'authentification:", error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  // }, [getMe]);
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 