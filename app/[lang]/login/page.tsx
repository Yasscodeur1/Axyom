import { getDictionary } from "@/lib/get-dictionary";
import LoginPageClient from "@/components/auth/login-page-client";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <LoginPageClient lang={lang} dict={dict} />;
}
