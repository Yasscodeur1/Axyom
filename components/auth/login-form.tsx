"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { login as loginUser } from "@/lib/api/auth";
import { useAuth } from "@/components/auth/auth-context";

interface LoginFormProps {
  lang: string;
  dict: any;
}

export default function LoginForm({ lang, dict }: LoginFormProps) {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await loginUser(formData.email, formData.password);
      
      // Rafraîchir le context d'authentification
      refreshUser();

      setSubmitStatus("success");
      
      // Redirection après 1 seconde
      setTimeout(() => {
        router.push(`/${lang}/orders`);
      }, 1000);
    } catch (error: any) {
      setSubmitStatus("error");
      setErrorMessage(error.message || dict.auth.errorLoggingIn);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Info Section */}
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            {dict.auth.loginSubtitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {dict.auth.loginDescription}
          </p>
        </div>

        {/* Benefits Quick View */}
        <div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground">{dict.auth.benefit1Title}</h3>
          <p className="text-sm text-muted-foreground">{dict.auth.benefit1Desc}</p>
          
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground">{dict.auth.benefit2Title}</h3>
            <p className="text-sm text-muted-foreground">{dict.auth.benefit2Desc}</p>
          </div>
        </div>

        {/* Create Account Link */}
        <div className="pt-4 border-t border-border">
          <p className="text-muted-foreground">
            {dict.auth.dontHaveAccount}{" "}
            <Link href={`/${lang}/register`} className="text-neon-cyan hover:underline font-medium">
              {dict.auth.registerHere}
            </Link>
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-xl bg-card p-6 lg:p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{dict.auth.loginSuccess}</p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && errorMessage && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {dict.auth.email} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={dict.auth.emailPlaceholder}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {dict.auth.password} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={dict.auth.passwordPlaceholder}
                className="pl-10 pr-10"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border text-neon-cyan focus:ring-neon-cyan"
              />
              <span className="text-sm text-muted-foreground">{dict.auth.rememberMe}</span>
            </label>
            <Link
              href={`/${lang}/forgot-password`}
              className="text-sm text-neon-cyan hover:underline"
            >
              {dict.auth.forgotPassword}
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full bg-foreground text-background hover:bg-neon-cyan transition-all",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {dict.auth.signingIn}
              </span>
            ) : (
              dict.auth.signIn
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
