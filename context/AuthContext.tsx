import React, { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments, useRootNavigationState } from 'expo-router';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => {},
  isAuthenticated: false,
});

// This hook can be used to access the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Dummy credentials for testing
const VALID_EMAIL = 'eco.nest@example.com';
const VALID_PASSWORD = 'password123';

// Hook to safely check if navigation is ready
function useNavigationReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Use a small delay to ensure navigation context is initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return isReady;
}

// Separate component to handle navigation-dependent logic
function NavigationHandler({ isAuthenticated }: { isAuthenticated: boolean }) {
  const segments = useSegments();
  const isNavigationReady = useNavigationReady();

  useEffect(() => {
    // Only proceed when navigation is ready
    if (!isNavigationReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, isNavigationReady]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async (email: string, password: string) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      return;
    }
    throw new Error('Invalid credentials');
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated }}>
      <NavigationHandler isAuthenticated={isAuthenticated} />
      {children}
    </AuthContext.Provider>
  );
}
