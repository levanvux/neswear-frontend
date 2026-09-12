"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { getMe, logout, refresh } from "@/services/auth";

type AuthContextType = {
  loading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshUser: () => Promise<void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const getOrRefreshAccessToken = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      return token;
    }

    const data = await refresh();
    const newToken = data.access_token;
    localStorage.setItem("access_token", newToken);
    return newToken;
  }, []);

  const refreshUser = useCallback(async () => {
    const token = await getOrRefreshAccessToken();
    const userData = await getMe(token);

    setAccessToken(token);
    setUser(userData);
  }, [getOrRefreshAccessToken]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      setAccessToken(null);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    async function init() {
      try {
        await refreshUser();
      } catch {
        localStorage.removeItem("access_token");
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [refreshUser]);

  const contextValue = useMemo(() => {
    return {
      loading,
      user,
      setUser,
      accessToken,
      setAccessToken,
      refreshUser,
      handleLogout,
    };
  }, [loading, user, accessToken, refreshUser, handleLogout]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
