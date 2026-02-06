'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Crown } from 'lucide-react';

interface SuccessPageProps {
  params: Promise<{ lang: string }>;
}

export default function SubscriptionSuccessPage({ params }: SuccessPageProps) {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('loading');
    const [lang, setLang] = useState('fr');

    useEffect(() => {
        params.then(({ lang: paramLang }) => {
            setLang(paramLang);
        });
    }, [params]);

    useEffect(() => {
        if (sessionId) {
            // Optionnel : Tu peux appeler ton API de vérification ici
            // pour confirmer que Laravel a bien reçu le webhook
            setStatus('success');
        }
    }, [sessionId]);

    const content = {
        fr: {
            title: "Bienvenue dans le Club AXYOM",
            subtitle: "Ton abonnement à 9,99€/mois est maintenant actif. Tu fais désormais partie de l'élite de la boutique.",
            benefitsTitle: "Vos nouveaux avantages :",
            benefits: [
                "Livraison gratuite sur TOUTES vos commandes",
                "-15% de réduction automatique au panier",
                "Accès prioritaire aux nouvelles drops"
            ],
            shopButton: "Profiter de mes avantages",
            manageButton: "Gérer mon abonnement",
            emailNote: "Un e-mail de confirmation vient de vous être envoyé."
        },
        en: {
            title: "Welcome to the AXYOM Club",
            subtitle: "Your €9.99/month subscription is now active. You are now part of the shop's elite.",
            benefitsTitle: "Your new benefits:",
            benefits: [
                "Free delivery on ALL your orders",
                "Automatic 15% discount in cart",
                "Priority access to new drops"
            ],
            shopButton: "Enjoy my benefits",
            manageButton: "Manage my subscription",
            emailNote: "A confirmation email has just been sent to you."
        }
    };

    const t = content[lang as keyof typeof content] || content.fr;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icône de succès animée */}
                <div className="relative mx-auto w-24 h-24 bg-neon-cyan rounded-full flex items-center justify-center text-background text-5xl shadow-xl animate-bounce">
                    <Crown className="h-12 w-12" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black font-serif tracking-tighter uppercase text-foreground">
                        {t.title}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {t.subtitle}
                    </p>
                </div>

                {/* Rappel des avantages immédiats */}
                <div className="bg-card rounded-2xl p-6 text-left space-y-3 border border-border">
                    <h3 className="font-bold text-sm uppercase text-muted-foreground">
                        {t.benefitsTitle}
                    </h3>
                    <ul className="space-y-2">
                        {t.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-cyan/10 shrink-0">
                                    <Check className="h-3 w-3 text-neon-cyan" />
                                </div>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <Link 
                        href={`/${lang}/products`}
                        className="w-full bg-neon-cyan text-background py-4 rounded-xl font-bold hover:bg-neon-cyan/90 transition-all uppercase tracking-widest"
                    >
                        {t.shopButton}
                    </Link>
                    <Link 
                        href={`/${lang}/account`}
                        className="text-sm font-semibold text-muted-foreground hover:text-neon-cyan transition-colors"
                    >
                        {t.manageButton}
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground pt-8">
                    {t.emailNote}
                </p>
            </div>
        </div>
    );
}