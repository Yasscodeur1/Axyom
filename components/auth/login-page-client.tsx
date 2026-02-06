"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface LoginPageClientProps {
  lang: string;
  dict: any;
}

export default function LoginPageClient({ lang, dict }: LoginPageClientProps) {
  return (
    <AuthGuard redirectTo={`/${lang}/orders`}>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/${lang}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-4"
            >
              ← {dict.common.backToHome}
            </Link>
            <div className="flex items-center gap-4">
              <LogIn className="h-8 w-8 text-neon-cyan" />
              <h1 className="text-4xl font-bold text-foreground">
                {dict.auth.loginTitle}
              </h1>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm lang={lang} dict={dict} />
        </div>
      </div>
    </AuthGuard>
  );
}
