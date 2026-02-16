import { NextResponse } from 'next/server';
import { products } from '@/lib/data/products';

/**
 * API Route pour vérifier les stocks disponibles
 * POST /api/products/check-stocks
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Vérifier les stocks et identifier les produits en rupture
    const availableStocks: Record<string, number> = {};
    const outOfStock: Array<{ id: string; name: string; available: number; requested: number }> = [];

    items.forEach((item: { id: string; quantity: number }) => {
      const product = products.find(p => p.id === item.id);
      if (product && product.stock !== undefined) {
        availableStocks[item.id] = product.stock;
        
        // Si la quantité demandée dépasse le stock disponible
        if (item.quantity > product.stock) {
          outOfStock.push({
            id: product.id,
            name: product.name,
            available: product.stock,
            requested: item.quantity
          });
        }
      }
    });

    // Si certains produits ont un stock insuffisant
    if (outOfStock.length > 0) {
      return NextResponse.json({
        success: false,
        availableStocks,
        outOfStock,
        message: 'Some items have insufficient stock'
      });
    }

    // Tous les stocks sont OK
    return NextResponse.json({
      success: true,
      availableStocks,
    });

  } catch (error) {
    console.error('Error checking stocks:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
