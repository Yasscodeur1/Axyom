'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-context';
import { Gift, Copy, CheckCircle, UserPlus, TrendingUp, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface ReferralData {
  referral_code: string;
  referral_link: string;
  total_referrals?: number;
  total_earned?: number;
}

interface ReferralBannerProps {
  lang: string;
  dict: any;
}

export function ReferralBanner({ lang, dict }: ReferralBannerProps) {
  const { user, token } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!token || !user) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/referral/my-code`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReferralData(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de parrainage:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchReferralData();
    }
  }, [user, token]);

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

  const shareVia = (platform: 'whatsapp' | 'messenger' | 'twitter') => {
    if (!referralData?.referral_link) return;

    const message = lang === 'fr' 
      ? `Découvre AXYOMSHOP avec mon code de parrainage ${referralData.referral_code}! 🎁` 
      : `Discover AXYOMSHOP with my referral code ${referralData.referral_code}! 🎁`;
    
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(referralData.referral_link);

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case 'messenger':
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID&redirect_uri=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  // Version pour utilisateur NON connecté
  if (!user) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-neon-cyan/10 via-neon-cyan/5 to-transparent border border-neon-cyan/20 p-8 lg:p-12">
        {/* Effet de fond */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl -z-10" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Contenu gauche */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 px-4 py-2">
              <Gift className="h-4 w-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">
                {lang === 'fr' ? 'Programme de Parrainage' : 'Referral Program'}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
                {lang === 'fr' 
                  ? 'Gagnez des récompenses en parrainant vos amis' 
                  : 'Earn rewards by referring friends'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {lang === 'fr'
                  ? 'Créez votre compte, partagez votre code unique et profitez d\'avantages exclusifs à chaque parrainage réussi.'
                  : 'Create your account, share your unique code and enjoy exclusive benefits with each successful referral.'}
              </p>
            </div>

            {/* Avantages */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    {lang === 'fr' ? '10% de commission' : '10% commission'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' 
                      ? 'Sur chaque achat de vos filleuls' 
                      : 'On every purchase from your referrals'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    {lang === 'fr' ? 'Bonus de bienvenue' : 'Welcome bonus'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' 
                      ? '5€ offerts dès le premier parrainage' 
                      : '€5 offered on first referral'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    {lang === 'fr' ? 'Illimité' : 'Unlimited'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' 
                      ? 'Parrainez autant d\'amis que vous voulez' 
                      : 'Refer as many friends as you want'}
                  </p>
                </div>
              </div>
            </div>

            <Link href={`/${lang}/register`}>
              <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 transition-all flex items-center gap-2 text-lg px-8 py-6 h-auto">
                <UserPlus className="h-5 w-5" />
                {lang === 'fr' ? 'Créer un compte pour parrainer' : 'Create account to refer'}
              </Button>
            </Link>
          </div>

          {/* Illustration droite */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-cyan/10 border-2 border-neon-cyan/30">
                    <Gift className="h-10 w-10 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-neon-cyan mb-2">
                      {lang === 'fr' ? 'Illimité' : 'Unlimited'}
                    </p>
                    <p className="text-muted-foreground">
                      {lang === 'fr' ? 'Récompenses possibles' : 'Possible rewards'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Version pour utilisateur CONNECTÉ
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-neon-cyan/10 via-neon-cyan/5 to-transparent border border-neon-cyan/20 p-8 lg:p-12">
      {/* Effet de fond */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl -z-10" />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-neon-cyan" />
        </div>
      ) : (
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Contenu gauche - Statistiques */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 px-4 py-2">
              <Gift className="h-4 w-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">
                {lang === 'fr' ? 'Votre Programme de Parrainage' : 'Your Referral Program'}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-3">
                {lang === 'fr' 
                  ? 'Partagez et gagnez' 
                  : 'Share and earn'}
              </h2>
              <p className="text-muted-foreground">
                {lang === 'fr'
                  ? `Bonjour ${user.first_name}, partagez votre code unique ci-dessous.`
                  : `Hello ${user.first_name}, share your unique code below.`}
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-neon-cyan" />
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' ? 'Filleuls' : 'Referrals'}
                  </p>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {referralData?.total_referrals || 0}
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' ? 'Gains' : 'Earnings'}
                  </p>
                </div>
                <p className="text-3xl font-bold text-green-500">
                  {(referralData?.total_earned || 0).toFixed(2)}€
                </p>
              </div>
            </div>

            {/* Lien vers la page complète */}
            <Link 
              href={`/${lang}/profile/referral`}
              className="inline-flex items-center gap-2 text-neon-cyan hover:underline text-sm font-medium"
            >
              {lang === 'fr' ? 'Voir tous les détails' : 'View all details'} →
            </Link>
          </div>

          {/* Contenu droite - Code et copie */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 lg:p-8 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                {lang === 'fr' ? 'Votre code unique :' : 'Your unique code:'}
              </p>
              <div className="bg-background/80 rounded-lg border border-neon-cyan/30 p-4 mb-4">
                <p className="text-3xl lg:text-4xl font-mono font-bold tracking-wider text-neon-cyan text-center">
                  {referralData?.referral_code || '---'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {lang === 'fr' ? 'Votre lien de parrainage :' : 'Your referral link:'}
              </p>
              <div className="bg-background/80 rounded-lg border border-border p-3 mb-4">
                <p className="text-sm font-mono text-foreground break-all">
                  {referralData?.referral_link || '---'}
                </p>
              </div>
            </div>

            <Button
              onClick={copyToClipboard}
              className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 transition-all flex items-center justify-center gap-2 text-lg py-6 h-auto"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  {lang === 'fr' ? '✓ Lien copié !' : '✓ Link copied!'}
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  {lang === 'fr' ? 'Copier mon lien' : 'Copy my link'}
                </>
              )}
            </Button>

            {/* Partage rapide */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {lang === 'fr' ? 'Partager via' : 'Share via'}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="flex items-center justify-center gap-3">
                {/* WhatsApp */}
                <button
                  onClick={() => shareVia('whatsapp')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all group"
                  title="WhatsApp"
                >
                  <svg className="h-6 w-6 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>

                {/* Messenger */}
                <button
                  onClick={() => shareVia('messenger')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF]/10 border border-[#0084FF]/20 hover:bg-[#0084FF]/20 transition-all group"
                  title="Messenger"
                >
                  <svg className="h-6 w-6 fill-[#0084FF]" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8l3.13 3.259L19.752 8l-6.559 6.963z"/>
                  </svg>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={() => shareVia('twitter')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 transition-all group"
                  title="X (Twitter)"
                >
                  <svg className="h-5 w-5 fill-foreground" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {lang === 'fr'
                ? 'Partagez ce lien avec vos amis pour gagner des récompenses'
                : 'Share this link with friends to earn rewards'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
