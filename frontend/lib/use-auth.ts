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

  const updateProfile = useCallback((profile: User["profile"]) => {
    const success = authUtils.updateUserProfile(profile || {});
    if (success) {
      const updatedUser = authUtils.getCurrentUser();
      setUser(updatedUser);
      return true;
    }
    return false;
  }, []);

  const updateUserInfo = useCallback((fullName: string, email: string) => {
    const success = authUtils.updateUserInfo(fullName, email);
    if (success) {
      const updatedUser = authUtils.getCurrentUser();
      setUser(updatedUser);
      return true;
    }
    return false;
  }, []);

  const deleteAccount = useCallback(() => {
    const success = authUtils.deleteAccount();
    if (success) {
      setUser(null);
      setIsAuthenticated(false);
      return true;
    }
    return false;
  }, []);

  const exportData = useCallback(() => {
    return authUtils.exportUserData();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updateUserInfo,
    deleteAccount,
    exportData,
  };
}
