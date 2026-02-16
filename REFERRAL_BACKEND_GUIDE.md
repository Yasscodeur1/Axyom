# 🎁 Bannière de Parrainage - Documentation Backend

## 📍 Endpoint requis

### GET `/api/referral/my-code`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Réponse attendue:**
```json
{
  "referral_code": "ABC123",
  "referral_link": "https://axyom.com/fr/register?ref=ABC123",
  "total_referrals": 5,
  "total_earned": 125.50
}
```

## 📝 Exemple de Controller Laravel

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    /**
     * Récupérer le code de parrainage de l'utilisateur connecté
     */
    public function getMyCode(Request $request)
    {
        $user = $request->user();

        // Générer ou récupérer le code de parrainage
        if (empty($user->referral_code)) {
            $user->referral_code = $this->generateReferralCode();
            $user->save();
        }

        // Calculer les statistiques
        $totalReferrals = $user->referrals()->count();
        
        // Calculer les gains (10% des achats des filleuls)
        $totalEarned = $user->referrals()
            ->with('orders')
            ->get()
            ->flatMap(fn($referral) => $referral->orders)
            ->sum(fn($order) => $order->total * 0.10);

        // Construire le lien
        $referralLink = config('app.frontend_url') . '/' . app()->getLocale() . '/register?ref=' . $user->referral_code;

        return response()->json([
            'referral_code' => $user->referral_code,
            'referral_link' => $referralLink,
            'total_referrals' => $totalReferrals,
            'total_earned' => round($totalEarned, 2),
        ]);
    }

    /**
     * Générer un code de parrainage unique
     */
    private function generateReferralCode()
    {
        do {
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        } while (\App\Models\User::where('referral_code', $code)->exists());

        return $code;
    }

    /**
     * Statistiques détaillées (pour la page /profile/referral)
     */
    public function getStats(Request $request)
    {
        $user = $request->user();

        $referrals = $user->referrals()
            ->with('orders')
            ->get()
            ->map(function ($referral) {
                return [
                    'id' => $referral->id,
                    'name' => $referral->first_name . ' ' . $referral->last_name,
                    'email' => $referral->email,
                    'is_member' => $referral->is_member ?? false,
                    'joined_at' => $referral->created_at->format('Y-m-d H:i:s'),
                    'orders_count' => $referral->orders->count(),
                    'total_spent' => $referral->orders->sum('total'),
                ];
            });

        $totalOrders = $referrals->sum('orders_count');
        $totalRevenue = $referrals->sum('total_spent');
        $totalEarned = $totalRevenue * 0.10; // 10% de commission

        return response()->json([
            'data' => [
                'total_referrals' => $referrals->count(),
                'active_referrals' => $user->referrals()->where('is_member', true)->count(),
                'total_orders' => $totalOrders,
                'total_revenue' => round($totalRevenue, 2),
                'total_earned' => round($totalEarned, 2),
                'referrals' => $referrals,
            ],
        ]);
    }
}
```

## 🗄️ Migration nécessaire

Si vous n'avez pas encore ajouté le champ `referral_code` et `referred_by` :

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('referral_code', 10)->unique()->nullable()->after('email');
            $table->unsignedBigInteger('referred_by')->nullable()->after('referral_code');
            
            $table->foreign('referred_by')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['referred_by']);
            $table->dropColumn(['referral_code', 'referred_by']);
        });
    }
};
```

## 📊 Modèle User

Ajouter la relation dans `app/Models/User.php` :

```php
/**
 * Obtenir les utilisateurs parrainés par cet utilisateur
 */
public function referrals()
{
    return $this->hasMany(User::class, 'referred_by');
}

/**
 * Obtenir l'utilisateur qui a parrainé cet utilisateur
 */
public function referrer()
{
    return $this->belongsTo(User::class, 'referred_by');
}
```

## 🛣️ Routes API

Dans `routes/api.php` :

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/referral/my-code', [ReferralController::class, 'getMyCode']);
    Route::get('/referral/stats', [ReferralController::class, 'getStats']);
});
```

## ✅ Enregistrement avec code de parrainage

Modifier `RegisterController` :

```php
public function register(Request $request)
{
    $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'referral_code' => 'nullable|string|exists:users,referral_code',
        // ... autres champs
    ]);

    // Trouver le parrain si un code est fourni
    $referrerId = null;
    if (!empty($validated['referral_code'])) {
        $referrer = User::where('referral_code', $validated['referral_code'])->first();
        if ($referrer) {
            $referrerId = $referrer->id;
        }
    }

    $user = User::create([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'referred_by' => $referrerId,
        // ... autres champs
    ]);

    // Créer le token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ], 201);
}
```

## 🎯 Commandes artisan

```bash
# Créer la migration
php artisan make:migration add_referral_fields_to_users_table

# Exécuter la migration
php artisan migrate

# Créer le controller
php artisan make:controller Api/ReferralController
```
