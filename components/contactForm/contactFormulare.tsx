"use client";

import { useState } from "react";
import { Send, Mail, Phone, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  lang: string;
  dict: any;
}

export default function ContactForm({ lang, dict }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simuler l'envoi (remplacer par votre logique d'API)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form data:", formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
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
            {dict.contact.subtitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {dict.contact.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10">
              <Mail className="h-5 w-5 text-neon-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Email</h3>
              <a href="mailto:contact@axyom.com" className="text-muted-foreground hover:text-neon-cyan transition-colors">
                contact@axyom.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10">
              <Phone className="h-5 w-5 text-neon-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{dict.contact.phone}</h3>
              <a href="tel:+33123456789" className="text-muted-foreground hover:text-neon-cyan transition-colors">
                +33 1 23 45 67 89
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-xl bg-card p-6 lg:p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {dict.contact.name} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={dict.contact.namePlaceholder}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {dict.contact.email} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={dict.contact.emailPlaceholder}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {dict.contact.phone} <span className="text-muted-foreground text-xs">({dict.contact.optional})</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={dict.contact.phonePlaceholder}
                className="pl-10"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              {dict.contact.subject} <span className="text-neon-cyan">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder={dict.contact.subjectPlaceholder}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              {dict.contact.message} <span className="text-neon-cyan">*</span>
            </Label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={dict.contact.messagePlaceholder}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              required
            />
          </div>

          {/* Submit Status */}
          {submitStatus === "success" && (
            <div className="rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 p-4 text-sm text-foreground">
              {dict.contact.successMessage}
            </div>
          )}
          {submitStatus === "error" && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {dict.contact.errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              "w-full h-12 font-medium",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {dict.common.loading}
              </span>
            ) : (
              <>
                {dict.contact.send}
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
