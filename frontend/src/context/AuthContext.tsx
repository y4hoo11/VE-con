import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types/Auth';
import { AUTH_CONFIG } from '../config/Auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem(AUTH_CONFIG.sessionKey);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const login = (userData: User) => {
    sessionStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};