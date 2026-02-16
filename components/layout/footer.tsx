import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  lang: string;
  dict: any;
}

export function Footer({ lang, dict }: FooterProps) {
  const footerLinks = {
    shop: [
      { name: dict.footer.allProducts, href: `/${lang}/products` },
      { name: dict.footer.newArrivals, href: `/${lang}/products?collection=new` },
      { name: dict.footer.bestsellers, href: `/${lang}/products?collection=featured` },
      { name: dict.footer.sale, href: `/${lang}/products?sale=true` },
    ],
    company: [
      { name: dict.footer.aboutUs, href: `/${lang}/about` },
      { name: dict.footer.sustainability, href: `/${lang}/sustainability` },
      { name: dict.footer.careers, href: `/${lang}/careers` },
      { name: dict.footer.press, href: `/${lang}/press` },
    ],
    support: [
      { name: dict.footer.contact, href: `/${lang}/contact` },
      { name: dict.footer.shipping, href: `/${lang}/shipping` },
      { name: dict.footer.returns, href: `/${lang}/returns` },
      { name: dict.footer.faq, href: `/${lang}/faq` },
    ],
    legal: [
      { name: dict.footer.privacy, href: `/${lang}/privacy` },
      { name: dict.footer.terms, href: `/${lang}/terms` },
      { name: dict.footer.cookies, href: `/${lang}/cookies` },
    ],
  };
  return (
    <footer className="border-t border-border bg-card pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-0 font-serif text-2xl tracking-widest text-foreground">
              <Image src="/AXyomshop.png" alt="AXYOM Logo" width={192} height={82} className="object-contain" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {dict.footer.brandDesc}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.shop}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.company}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.support}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.legal}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 lg:flex-row">
          <p className="text-sm text-muted-foreground">
            {dict.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">{dict.cart.shippingNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
