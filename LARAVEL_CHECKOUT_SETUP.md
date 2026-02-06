# Configuration Laravel pour le Checkout

## Structure de la Requête API

Votre formulaire Next.js envoie les données suivantes à Laravel :

### Endpoint
```
POST /api/checkout
```

### Headers
```
Content-Type: application/json
Accept: application/json
```

### Payload JSON
```json
{
  "customer": {
    "email": "client@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "phone": "+33612345678",
    "address": "123 Rue de la Mode",
    "city": "Paris",
    "postal_code": "75001",
    "country": "France"
  },
  "order": {
    "items": [
      {
        "product_id": "1",
        "product_name": "Premium Jacket",
        "product_slug": "premium-jacket",
        "price": 199.99,
        "quantity": 2,
        "size": "M",
        "color": "Black",
        "image": "https://example.com/image.jpg"
      }
    ],
    "subtotal": 399.98,
    "shipping_cost": 4.99,
    "total": 404.97,
    "is_subscriber": false,
    "subscription_fee": 0,
    "grand_total": 404.97,
    "currency": "EUR",
    "language": "fr"
  }
}
```

## Réponse Attendue de Laravel

### Option 1 : Redirection vers Stripe
```json
{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "order_number": "ORD-2026-001234"
}
```

### Option 2 : Confirmation directe (pour test)
```json
{
  "success": true,
  "order_number": "ORD-2026-001234",
  "message": "Order created successfully"
}
```

### En cas d'erreur
```json
{
  "success": false,
  "message": "Stock insuffisant pour le produit Premium Jacket"
}
```

## Exemple de Route Laravel

### routes/api.php
```php
<?php

use App\Http\Controllers\CheckoutController;

Route::post('/checkout', [CheckoutController::class, 'createCheckout']);
```

### app/Http/Controllers/CheckoutController.php
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class CheckoutController extends Controller
{
    public function createCheckout(Request $request)
    {
        // Valider les données
        $validated = $request->validate([
            'customer.email' => 'required|email',
            'customer.first_name' => 'required|string',
            'customer.last_name' => 'required|string',
            'order.items' => 'required|array|min:1',
            'order.grand_total' => 'required|numeric',
        ]);

        // Créer le client dans la DB
        $customer = Customer::updateOrCreate(
            ['email' => $request->customer['email']],
            $request->customer
        );

        // Créer la commande
        $order = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-' . date('Y') . '-' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
            'subtotal' => $request->order['subtotal'],
            'shipping_cost' => $request->order['shipping_cost'],
            'total' => $request->order['grand_total'],
            'is_subscriber' => $request->order['is_subscriber'],
            'currency' => $request->order['currency'],
            'language' => $request->order['language'],
            'status' => 'pending',
        ]);

        // Ajouter les articles
        foreach ($request->order['items'] as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'product_name' => $item['product_name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'size' => $item['size'],
                'color' => $item['color'],
            ]);
        }

        // Créer la session Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = collect($request->order['items'])->map(function ($item) {
            return [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $item['product_name'],
                        'description' => "Size: {$item['size']}, Color: {$item['color']}",
                        'images' => [$item['image']],
                    ],
                    'unit_amount' => round($item['price'] * 100), // En centimes
                ],
                'quantity' => $item['quantity'],
            ];
        })->toArray();

        // Ajouter frais de livraison si applicable
        if ($request->order['shipping_cost'] > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Shipping',
                    ],
                    'unit_amount' => round($request->order['shipping_cost'] * 100),
                ],
                'quantity' => 1,
            ];
        }

        // Ajouter abonnement si applicable
        if ($request->order['is_subscriber'] && $request->order['subscription_fee'] > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'AXYOM Membership',
                    ],
                    'unit_amount' => round($request->order['subscription_fee'] * 100),
                ],
                'quantity' => 1,
            ];
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => config('app.frontend_url') . "/{$request->order['language']}/checkout/success?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => config('app.frontend_url') . "/{$request->order['language']}/checkout?canceled=true",
            'customer_email' => $customer->email,
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
        ]);

        // Sauvegarder l'ID de session Stripe
        $order->update(['stripe_session_id' => $session->id]);

        return response()->json([
            'success' => true,
            'checkout_url' => $session->url,
            'order_number' => $order->order_number,
        ]);
    }
}
```

## Migrations Laravel Nécessaires

### Customers Table
```php
Schema::create('customers', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('first_name');
    $table->string('last_name');
    $table->string('phone')->nullable();
    $table->string('address');
    $table->string('city');
    $table->string('postal_code');
    $table->string('country');
    $table->timestamps();
});
```

### Orders Table
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('customer_id')->constrained()->onDelete('cascade');
    $table->string('order_number')->unique();
    $table->decimal('subtotal', 10, 2);
    $table->decimal('shipping_cost', 10, 2);
    $table->decimal('total', 10, 2);
    $table->boolean('is_subscriber')->default(false);
    $table->string('currency', 3)->default('EUR');
    $table->string('language', 2)->default('en');
    $table->string('status')->default('pending'); // pending, paid, shipped, completed, canceled
    $table->string('stripe_session_id')->nullable();
    $table->timestamps();
});
```

### Order Items Table
```php
Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->string('product_id');
    $table->string('product_name');
    $table->decimal('price', 10, 2);
    $table->integer('quantity');
    $table->string('size');
    $table->string('color');
    $table->timestamps();
});
```

## Configuration Stripe dans Laravel

### config/services.php
```php
'stripe' => [
    'secret' => env('STRIPE_SECRET_KEY'),
    'public' => env('STRIPE_PUBLIC_KEY'),
],
```

### .env Laravel
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
FRONTEND_URL=http://localhost:3000
```

## Installation du Package Stripe
```bash
composer require stripe/stripe-php
```

## Webhook Stripe (optionnel mais recommandé)

### Route webhook
```php
Route::post('/webhook/stripe', [WebhookController::class, 'handleStripe']);
```

### Controller
```php
public function handleStripe(Request $request)
{
    $payload = $request->getContent();
    $sig_header = $request->header('Stripe-Signature');
    $endpoint_secret = config('services.stripe.webhook_secret');

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $order = Order::where('stripe_session_id', $session->id)->first();
            
            if ($order) {
                $order->update(['status' => 'paid']);
                // Envoyer email de confirmation
            }
        }

        return response()->json(['status' => 'success']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}
```

## Configuration Next.js

### .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Test de l'intégration

1. Démarrez Laravel : `php artisan serve`
2. Démarrez Next.js : `npm run dev`
3. Testez le checkout avec une carte test Stripe : `4242 4242 4242 4242`

## URLs de retour Stripe

- **Success**: `/{lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel**: `/{lang}/checkout?canceled=true`

Vous devrez créer la page `app/[lang]/checkout/success/page.tsx` pour gérer le retour après paiement.
