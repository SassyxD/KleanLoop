import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  email: string;
  name: string;
  type: 'personal' | 'corporate';
  reputationPoints: number;
  tier: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via cookie
    const userId = getCookie('userId');
    const userType = getCookie('userType');
    
    if (userId && userType) {
      // In a real app, you'd fetch user data from API
      // For now, we'll create a minimal user object
      setUser({
        id: parseInt(userId),
        email: '',
        name: '',
        type: userType as 'personal' | 'corporate',
        reputationPoints: 0,
        tier: 'bronze',
      });
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    document.cookie = `userId=${userData.id}; path=/; max-age=86400`;
    document.cookie = `userType=${userData.type}; path=/; max-age=86400`;
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'userId=; path=/; max-age=0';
    document.cookie = 'userType=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}
