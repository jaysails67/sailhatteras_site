import { createContext, useContext, ReactNode, useEffect } from "react";
import { useGetMe, useLogoutUser, User, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError, error } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: 'stale',
      retry: (failureCount, error) => {
        if ((error as { status?: number })?.status === 401) return false;
        return failureCount < 2;
      },
    },
  });
  const logoutMutation = useLogoutUser();

  // Only invalidate cache on 401 once, not on every render
  useEffect(() => {
    if ((error as { status?: number })?.status === 401) {
      queryClient.setQueryData(getGetMeQueryKey(), null);
    }
  }, [error?.status, queryClient]);

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.clear();
    
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/login";
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: isError ? null : user ?? null,
        isLoading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
