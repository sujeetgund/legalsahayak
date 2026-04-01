"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";

type UserProfile = {
  age?: number;
  gender?: string;
  location?: string;
  education_level?: string;
  job_title?: string;
  preferred_language?: "en" | "hi";
};

type AppUser = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  profile?: UserProfile;
};

const profileStorageKey = (userId: string) => `legalsahayak_profile_${userId}`;

const getStoredProfile = (userId: string): UserProfile => {
  try {
    const raw = window.localStorage.getItem(profileStorageKey(userId));
    return raw ? (JSON.parse(raw) as UserProfile) : {};
  } catch {
    return {};
  }
};

const setStoredProfile = (userId: string, profile: UserProfile) => {
  window.localStorage.setItem(
    profileStorageKey(userId),
    JSON.stringify(profile),
  );
};

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [profileOverride, setProfileOverride] = useState<UserProfile | null>(
    null,
  );

  const profile = useMemo<UserProfile>(() => {
    if (profileOverride) {
      return profileOverride;
    }

    if (!isSignedIn || !user || typeof window === "undefined") {
      return {};
    }

    return getStoredProfile(user.id);
  }, [isSignedIn, profileOverride, user]);

  const mappedUser: AppUser | null = useMemo(() => {
    if (!isSignedIn || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      fullName: user.fullName || user.username || "User",
      createdAt: user.createdAt
        ? user.createdAt.toISOString()
        : new Date().toISOString(),
      profile,
    };
  }, [isSignedIn, profile, user]);

  const updateProfile = useCallback(
    async (nextProfile: AppUser["profile"]) => {
      if (!user) {
        return false;
      }

      const merged = { ...profile, ...(nextProfile || {}) };
      setProfileOverride(merged);
      setStoredProfile(user.id, merged);
      return true;
    },
    [profile, user],
  );

  const updatePreferredLanguage = useCallback(
    async (language: "en" | "hi") => {
      return updateProfile({ preferred_language: language });
    },
    [updateProfile],
  );

  const updateUserInfo = useCallback(
    async (fullName: string, email: string) => {
      if (!user) {
        return false;
      }

      try {
        const [firstName, ...rest] = fullName.trim().split(" ");
        const lastName = rest.join(" ").trim() || null;

        await user.update({
          firstName: firstName || null,
          lastName,
        });

        const currentEmail = user.primaryEmailAddress?.emailAddress;
        return !email || !currentEmail || email === currentEmail;
      } catch {
        return false;
      }
    },
    [user],
  );

  const deleteAccount = useCallback(async () => {
    if (!user) {
      return false;
    }

    try {
      await user.delete();
      return true;
    } catch {
      return false;
    }
  }, [user]);

  const exportData = useCallback(() => {
    if (!mappedUser) {
      return null;
    }

    const data = {
      id: mappedUser.id,
      fullName: mappedUser.fullName,
      email: mappedUser.email,
      createdAt: mappedUser.createdAt,
      profile: mappedUser.profile,
    };

    return JSON.stringify(data, null, 2);
  }, [mappedUser]);

  const logout = useCallback(() => {
    void signOut({ redirectUrl: "/signin" });
  }, [signOut]);

  const notImplemented = useCallback(() => null, []);

  return {
    user: mappedUser,
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    login: notImplemented,
    register: notImplemented,
    logout,
    updateProfile,
    updateUserInfo,
    updatePreferredLanguage,
    deleteAccount,
    exportData,
  };
}
