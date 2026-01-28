// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['en', 'fr']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Déterminer la langue préférée de l'utilisateur
  const acceptLanguage = request.headers.get('accept-language') || ''
  let locale = 'en' // langue par défaut
  
  // Vérifier si l'utilisateur préfère le français
  if (acceptLanguage.includes('fr')) {
    locale = 'fr'
  }
  
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}