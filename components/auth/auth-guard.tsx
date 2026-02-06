"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAuth = false, redirectTo }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if auth is required but user is not authenticated
        router.push(redirectTo || "/login");
      } else if (!requireAuth && isAuthenticated && redirectTo) {
        // Redirect away from login/register if already authenticated
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon-cyan border-t-transparent"></div>
      </div>
    );
  }

  // If requireAuth is true and user is not authenticated, don't show content
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If user is authenticated and on login/register page, don't show content
  if (!requireAuth && isAuthenticated && redirectTo) {
    return null;
  }

  return <>{children}</>;
}
