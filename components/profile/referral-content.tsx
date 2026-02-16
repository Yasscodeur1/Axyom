'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-context';
import { Copy, Users, ShoppingBag, TrendingUp, Gift, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface ReferralData {
  referral_code: string;
  referral_link: string;
}

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_orders: number;
  total_revenue: number;
  referrals: Array<{
    id: number;
    name: string;
    email: string;
    is_member: boolean;
    joined_at: string;
    orders_count: number;
    total_spent: number;
  }>;
}

interface ReferralContentProps {
  lang: string;
  dict: any;
}

export default function ReferralContent({ lang, dict }: ReferralContentProps) {
  const { token } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!token) {
        setError(lang === 'fr' ? 'Non authentifié' : 'Not authenticated');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        
        // Récupérer le code de parrainage
        const codeResponse = await fetch(`${API_URL}/api/referral/my-code`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!codeResponse.ok) {
          throw new Error(lang === 'fr' ? 'Erreur lors de la récupération du code' : 'Error fetching code');
        }

        const codeData = await codeResponse.json();
        setReferralData(codeData);

        // Récupérer les statistiques
        const statsResponse = await fetch(`${API_URL}/api/referral/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!statsResponse.ok) {
          throw new Error(lang === 'fr' ? 'Erreur lors de la récupération des statistiques' : 'Error fetching stats');
        }

        const statsData = await statsResponse.json();
        setStats(statsData.data || statsData);
      } catch (error: any) {
        console.error('Erreur lors de la récupération des données:', error);
        setError(error.message || (lang === 'fr' ? 'Une erreur est survenue' : 'An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [token, lang]);

  const copyToClipboard = async () => {
    if (referralData?.referral_link) {
      try {
        await navigator.clipboard.writeText(referralData.referral_link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-neon-cyan" />
          <p className="text-muted-foreground">
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl text-foreground">
          {lang === 'fr' ? 'Programme de Parrainage' : 'Referral Program'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {lang === 'fr' 
            ? 'Invitez vos amis et gagnez des récompenses !' 
            : 'Invite your friends and earn rewards!'}
        </p>
      </div>

      {/* Code de parrainage */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-neon-cyan/20 via-neon-cyan/10 to-transparent border border-neon-cyan/30 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl -z-10" />
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {lang === 'fr' ? 'Votre code de parrainage' : 'Your referral code'}
        </h2>
        
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {lang === 'fr' ? 'Votre code unique :' : 'Your unique code:'}
              </p>
              <p className="text-4xl lg:text-5xl font-mono font-bold tracking-wider text-neon-cyan">
                {referralData?.referral_code || '---'}
              </p>
            </div>
            
            <Button
              onClick={copyToClipboard}
              className="bg-neon-cyan text-background hover:bg-neon-cyan/90 transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {lang === 'fr' ? 'Copié !' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {lang === 'fr' ? 'Copier le lien' : 'Copy link'}
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              {lang === 'fr' ? 'Lien de parrainage :' : 'Referral link:'}
            </p>
            <p className="text-sm font-mono text-foreground break-all bg-background/50 p-3 rounded border border-border">
              {referralData?.referral_link || '---'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-card rounded-lg border border-border p-6 hover:border-neon-cyan/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {lang === 'fr' ? 'Total Filleuls' : 'Total Referrals'}
            </h3>
            <Users className="h-5 w-5 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.total_referrals || 0}</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6 hover:border-neon-cyan/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {lang === 'fr' ? 'Membres Actifs' : 'Active Members'}
            </h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">{stats?.active_referrals || 0}</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6 hover:border-neon-cyan/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {lang === 'fr' ? 'Commandes' : 'Orders'}
            </h3>
            <ShoppingBag className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-500">{stats?.total_orders || 0}</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6 hover:border-neon-cyan/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {lang === 'fr' ? 'Revenus générés' : 'Revenue Generated'}
            </h3>
            <TrendingUp className="h-5 w-5 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan">
            {(stats?.total_revenue || 0).toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Liste des filleuls */}
      {stats?.referrals && stats.referrals.length > 0 ? (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">
              {lang === 'fr' ? 'Vos Filleuls' : 'Your Referrals'}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {lang === 'fr' ? 'Nom' : 'Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {lang === 'fr' ? 'Statut' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {lang === 'fr' ? 'Inscription' : 'Joined'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {lang === 'fr' ? 'Commandes' : 'Orders'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {lang === 'fr' ? 'Dépensé' : 'Spent'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {referral.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {referral.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          referral.is_member
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {referral.is_member 
                          ? (lang === 'fr' ? 'Membre' : 'Member')
                          : (lang === 'fr' ? 'Gratuit' : 'Free')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(referral.joined_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                      {referral.orders_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neon-cyan">
                      {referral.total_spent.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Message si aucun filleul */
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-cyan/10">
              <Gift className="h-10 w-10 text-neon-cyan" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {lang === 'fr' ? 'Commencez à parrainer !' : 'Start referring!'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {lang === 'fr'
              ? 'Partagez votre code avec vos amis et commencez à gagner des récompenses.'
              : 'Share your code with friends and start earning rewards.'}
          </p>
        </div>
      )}
    </div>
  );
}
