import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// Nous importerons useMeLazyQuery une fois qu'il sera généré
// import { useMeLazyQuery } from '../apollo/generated';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Nous utiliserons cette query une fois générée
  // const [getMe] = useMeLazyQuery();

  useEffect(() => {
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

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
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
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; 