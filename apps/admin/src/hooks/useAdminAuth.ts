import { admin } from "@/lib/orpc";
import type { AdminLoginReq } from "@lobango/contracts/admin";
import { useCallback, useState } from "react";

export interface UseAdminAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: AdminLoginReq) => Promise<boolean>;
  logout: () => Promise<boolean>;
  verifyAuth: () => Promise<boolean>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: AdminLoginReq): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await admin.auth.login(credentials);
        return res.success;
      } catch (err) {
        console.error("Admin login error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Invalid credentials. Please try again."
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await admin.auth.logout();
      return res.success;
    } catch (err) {
      console.error("Admin logout error:", err);
      setError(err instanceof Error ? err.message : "Logout failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyAuth = useCallback(async (): Promise<boolean> => {
    try {
      await admin.permission.get.newOrder();
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    isLoading,
    error,
    login,
    logout,
    verifyAuth,
  };
}
