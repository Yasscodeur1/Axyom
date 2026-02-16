import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data/blog'

// Fonction pour récupérer les produits depuis l'API
async function getProductsForSitemap() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000"
    
    const response = await fetch(`${apiUrl}/api/products`, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const products = Array.isArray(data) ? data : (data.data || [])
    
    // Retourner seulement les données nécessaires pour le sitemap
    return products.map((product: any) => ({
      id: product.id.toString(),
      slug: product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      updated_at: product.updated_at || new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des produits pour sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axyomshop.com'
  const languages = ['fr', 'en']
  
  // Pages statiques importantes
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/products', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/subscribe', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/about', priority: 0.6, changeFreq: 'monthly' as const },
  ]
  
  // Générer URLs pour chaque langue (pages statiques)
  const staticUrls = languages.flatMap(lang => 
    staticPages.map(page => ({
      url: `${baseUrl}/${lang}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    }))
  )
  
  // Pages produits dynamiques
  const products = await getProductsForSitemap()
  const productUrls = languages.flatMap(lang =>
    products.map((product: { slug: any; updated_at: string | number | Date }) => ({
      url: `${baseUrl}/${lang}/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )
  
  // Pages blog dynamiques
  const blogUrls = languages.flatMap(lang =>
    blogPosts.map(post => ({
      url: `${baseUrl}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )
  
  // Pages authentification (basse priorité, mais indexables)
  const authPages = [
    { path: '/login', priority: 0.4 },
    { path: '/register', priority: 0.4 },
  ]
  
  const authUrls = languages.flatMap(lang =>
    authPages.map(page => ({
      url: `${baseUrl}/${lang}${page.path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    }))
  )
  
  return [...staticUrls, ...productUrls, ...blogUrls, ...authUrls]
}
