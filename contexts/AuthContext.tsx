"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { getMe, logout, refresh } from "@/services/auth";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      router.push("/");
    }
  };

  useEffect(() => {
    async function init() {
      try {
        let token = localStorage.getItem("access_token");

        if (!token) {
          const data = await refresh();
          token = data.access_token;

          localStorage.setItem("access_token", token);
        }

        setUser(await getMe(token));
      } catch {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
