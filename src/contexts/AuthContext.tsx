'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserService } from '@/services';
import { CircularProgress } from '@mui/material';

interface User {
  _id: string;
  name: string;
  email: string;
  theme: 'default' | 'pink' | 'blue' | 'green' | 'light';
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const publicRoutes = ['/auth/login', '/auth/register'];
        
        if (!user) {
          const { user: sessionUser } = await UserService.checkSession();
          setUser(sessionUser);
          
          if (publicRoutes.includes(pathname)) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        if (!pathname.includes('/auth')) {
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
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