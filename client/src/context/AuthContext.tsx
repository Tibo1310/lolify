import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // Nous utiliserons cette query une fois générée
  // const [getMe] = useMeLazyQuery();

  const { data: userData, loading: userLoading } = useQuery(GET_ME, {
    skip: !token,
  });

  useEffect(() => {
    if (!userLoading && userData?.me) {
      setUser(userData.me);
      setIsAuthenticated(true);
    }
    setLoading(userLoading);
  }, [userData, userLoading]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
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