import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'fr']
const defaultLocale = 'fr'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si le pathname contient déjà une locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirection vers la racine sans locale
  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language') || ''
    let locale = defaultLocale
    
    // Vérifier si l'utilisateur préfère l'anglais
    if (acceptLanguage.includes('en') && !acceptLanguage.includes('fr')) {
      locale = 'en'
    }
    
    request.nextUrl.pathname = `/${locale}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Pour toutes les autres routes, ajouter la locale par défaut
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques et API
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|Axyom.*\\.png).*)',
  ],
}
