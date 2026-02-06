import { getDictionary } from "@/lib/get-dictionary";
import RegisterPageClient from "@/components/auth/register-page-client";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <RegisterPageClient lang={lang} dict={dict} />;
}