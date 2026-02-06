import { useState, useEffect, useCallback } from "react";
import { authUtils, User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    try {
      const currentUser = authUtils.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(currentUser !== null);
    } catch (error) {
      console.error("Failed to load auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const loggedInUser = authUtils.signin(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    }
    return null;
  }, []);

  const register = useCallback(
    (email: string, password: string, fullName: string) => {
      const success = authUtils.signup(email, password, fullName);
      if (success) {
        const newUser = authUtils.getCurrentUser();
        setUser(newUser);
        setIsAuthenticated(true);
        return newUser;
      }
      return null;
    },
    [],
  );

  const logout = useCallback(() => {
    authUtils.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
