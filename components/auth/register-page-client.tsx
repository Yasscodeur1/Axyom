"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";
import { UserPlus } from "lucide-react";

interface RegisterPageClientProps {
  lang: string;
  dict: any;
}

export default function RegisterPageClient({ lang, dict }: RegisterPageClientProps) {
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
              <UserPlus className="h-8 w-8 text-neon-cyan" />
              <h1 className="text-4xl font-bold text-foreground">
                {dict.auth.registerTitle}
              </h1>
            </div>
          </div>

          {/* Register Form */}
          <RegisterForm lang={lang} dict={dict} />
        </div>
      </div>
    </AuthGuard>
  );
}
