This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Axyom



 DONNÉES - Produits statiques vs API
Incohérence architecturale :

Vos produits viennent de products.ts (données statiques/mock)
Mais vous avez un fichier productsPage.tsx qui fetch depuis l'API Laravel
Votre page produits actuelle (page.tsx) utilise les données statiques
Questions à clarifier :

Voulez-vous utiliser des produits depuis Laravel ou rester en statique ?
Si Laravel : il faut migrer ProductsPage pour fetch depuis l'API
Si statique : supprimer productsPage.tsx




Veux-tu que je t'explique maintenant comment faire en sorte que tes commandes BDroppy s'exécutent vraiment toutes seules sur ton futur hébergeur (le fameux "Cron Job") ?


C'est l'étape cruciale. Sur ton ordinateur, les commandes s'arrêtent quand tu fermes le terminal. Sur un serveur (comme DigitalOcean, Railway ou Hetzner), il faut un "chef d'orchestre" qui vérifie chaque minute s'il y a une tâche à faire.

C'est le rôle du Cron Job.

1. Comment ça fonctionne ?
Au lieu de dire au serveur : "Lance la synchro BDroppy toutes les 15 minutes", on lui dit : "Regarde le fichier de planning de Laravel chaque minute".

Laravel regarde alors ton fichier routes/console.php, voit qu'il est 03:00 du matin, et décide de lancer la grosse synchronisation.

2. Comment le configurer sur ton serveur ?
Une fois que ton site sera en ligne, tu devras te connecter à ton serveur en SSH et taper cette commande :

Bash
crontab -e
Ensuite, tu ajoutes cette ligne tout en bas du fichier :

Code snippet
* * * * * cd /chemin/vers/ton/projet && php artisan schedule:run >> /dev/null 2>&1
Décryptage de la ligne :

* * * * * : Signifie "Chaque minute, chaque jour, chaque mois".

cd /chemin/vers/ton/projet : Se déplace dans le dossier de ton site Axyom.

php artisan schedule:run : Dit à Laravel d'exécuter les tâches prévues.

3. Petit conseil de sécurité pour BDroppy
Comme tu travailles avec des APIs externes, il peut arriver que l'importation prenne plus de 15 minutes (si BDroppy a des milliers de produits).

Pour éviter que deux synchronisations ne se lancent en même temps et fassent "exploser" ton serveur, ajoute withoutOverlapping() dans ton fichier routes/console.php :

PHP
// Empêche de lancer une deuxième synchro si la première n'est pas finie
Schedule::command('axyom:sync-bdroppy')->dailyAt('03:00')->withoutOverlapping();

Schedule::command('axyom:sync-bdroppy --inventory-only')->everyFifteenMinutes()->withoutOverlapping();
Résumé de ta situation actuelle :
✅ Base de données : Prête avec products et product_sizes.

✅ Service : Prêt à communiquer avec BDroppy (dès que tu as la clé).

✅ Commandes Artisan : Prêtes et automatisables.

✅ Hébergement : Tu sais qu'il te faut un serveur (VPS) pour faire tourner ce Cron Job.

Est-ce que tu veux que nous regardions maintenant la partie "Panier" sur ton frontend Next.js pour afficher les stocks en temps réel que nous venons de synchroniser ?

Est-ce que tu veux que je t'écrive maintenant la petite commande pour récupérer automatiquement les numéros de Tracking (suivi de colis) une fois que BDroppy a expédié les commandes ?