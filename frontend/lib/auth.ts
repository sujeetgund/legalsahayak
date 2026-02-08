// Authentication utilities using localStorage

export interface UserProfile {
  age?: number;
  gender?: string;
  location?: string;
  education_level?: string;
  job_title?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
  profile?: UserProfile;
}

const USERS_STORAGE_KEY = "legalsahayak_users";
const CURRENT_USER_STORAGE_KEY = "legalsahayak_current_user";

export const authUtils = {
  // Register a new user
  signup: (email: string, password: string, fullName: string): boolean => {
    try {
      const users = authUtils.getAllUsers();

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        password, // In production, this should be hashed
        fullName,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Auto login after signup
      authUtils.setCurrentUser(newUser);

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  },

  // Login user
  signin: (email: string, password: string): User | null => {
    try {
      const users = authUtils.getAllUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (user) {
        authUtils.setCurrentUser(user);
        return user;
      }

      return null;
    } catch (error) {
      console.error("Signin error:", error);
      return null;
    }
  },

  // Logout user
  logout: (): void => {
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Get current logged in user
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Set current user
  setCurrentUser: (user: User): void => {
    try {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Set current user error:", error);
    }
  },

  // Get all users (for testing purposes)
  getAllUsers: (): User[] => {
    try {
      const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error("Get all users error:", error);
      return [];
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authUtils.getCurrentUser() !== null;
  },

  // Update user profile with onboarding details
  updateUserProfile: (profile: UserProfile): boolean => {
    try {
      const currentUser = authUtils.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Update current user
      const updatedUser: User = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          ...profile,
        },
      };

      // Update in localStorage
      authUtils.setCurrentUser(updatedUser);

      // Update in users list
      const users = authUtils.getAllUsers();
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      return true;
    } catch (error) {
      console.error("Update user profile error:", error);
      return false;
    }
  },

  // Update user basic info (name, email)
  updateUserInfo: (fullName: string, email: string): boolean => {
    try {
      const currentUser = authUtils.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Check if new email is already taken by another user
      const users = authUtils.getAllUsers();
      const emailTaken = users.some(
        (u) => u.email === email && u.id !== currentUser.id,
      );
      if (emailTaken) {
        return false;
      }

      // Update current user
      const updatedUser: User = {
        ...currentUser,
        fullName,
        email,
      };

      // Update in localStorage
      authUtils.setCurrentUser(updatedUser);

      // Update in users list
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      return true;
    } catch (error) {
      console.error("Update user info error:", error);
      return false;
    }
  },

  // Delete user account
  deleteAccount: (): boolean => {
    try {
      const currentUser = authUtils.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Remove from users list
      const users = authUtils.getAllUsers();
      const filteredUsers = users.filter((u) => u.id !== currentUser.id);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));

      // Clear current user
      authUtils.logout();

      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      return false;
    }
  },

  // Export user data
  exportUserData: (): string | null => {
    try {
      const currentUser = authUtils.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      // Remove password from export for security
      const { password, ...userDataWithoutPassword } = currentUser;

      return JSON.stringify(userDataWithoutPassword, null, 2);
    } catch (error) {
      console.error("Export user data error:", error);
      return null;
    }
  },

  // Clear all auth data (for testing/logout)
  clearAuth: (): void => {
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (error) {
      console.error("Clear auth error:", error);
    }
  },
};
