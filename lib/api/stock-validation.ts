/**
 * API Laravel - Endpoint pour vérifier les stocks
 * 
 * Route: POST /api/products/check-stocks
 * 
 * Exemple de requête depuis Next.js :
 * ```
 * POST http://localhost:8000/api/products/check-stocks
 * Content-Type: application/json
 * 
 * {
 *   "items": [
 *     { "id": "1", "qty": 3 },
 *     { "id": "2", "qty": 5 }
 *   ]
 * }
 * ```
 * 
 * Exemple de réponse attendue :
 * ```
 * {
 *   "availableStocks": {
 *     "1": 15,  // Stock disponible pour le produit ID 1
 *     "2": 3    // Stock disponible pour le produit ID 2 (sera ajusté)
 *   }
 * }
 * ```
 * 
 * Code Laravel exemple (à adapter) :
 * 
 * ```php
 * // app/Http/Controllers/Api/ProductController.php
 * 
 * public function checkStocks(Request $request)
 * {
 *     $items = $request->input('items', []);
 *     $availableStocks = [];
 * 
 *     foreach ($items as $item) {
 *         $product = Product::find($item['id']);
 *         if ($product) {
 *             // Retourne le stock réel disponible
 *             $availableStocks[$item['id']] = $product->stock;
 *         }
 *     }
 * 
 *     return response()->json([
 *         'availableStocks' => $availableStocks
 *     ]);
 * }
 * 
 * // routes/api.php
 * Route::post('products/check-stocks', [ProductController::class, 'checkStocks']);
 * ```
 */

export interface StockCheckRequest {
  items: Array<{
    id: string;
    qty: number;
  }>;
}

export interface StockCheckResponse {
  availableStocks: Record<string, number>;
}
