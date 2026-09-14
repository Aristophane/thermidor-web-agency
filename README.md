# Thermidor — site vitrine bilingue

Site public français / anglais, six expertises, pages Clients et Apps, formulaire de contact et administration des fiches. Rendu HTML côté serveur avec Express, SQLite intégré à Node 24, images WebP via Sharp, email SMTP avec Nodemailer. Aucun framework JavaScript côté public, aucun service de contenu externe.

## Lancer en local

```sh
npm ci
node scripts/setup-local.js
npm start
```

Si la configuration locale existe déjà, passer l’étape `setup-local.js` : ce script refuse d’écraser un `.env` existant.

- Site : http://localhost:3000
- Version anglaise : http://localhost:3000/en
- Administration : http://localhost:3000/admin
- Identifiants locaux : `.local/admin-access.txt` (non servi par le serveur, exclu de Git et de Docker).
- Développement avec redémarrage automatique : `npm run dev`.

Utiliser le serveur Node pour consulter le site : l’administration, les pages et le formulaire sont rendus par ce serveur. Les anciennes maquettes sont conservées dans `archive/initial-site/` dans le workspace d’origine ; elles ne font pas partie de ce dépôt.

## Modifier les contenus

Les pages et expertises FR/EN sont définies dans `src/content.js`, les templates dans `src/views.js`, le style dans `public/style.css`.

Les trois références initiales sont SNV, Maison Charlet et Junaki. Leurs visuels sont de vraies captures des sites fournis, converties en WebP et hébergées localement. Les descriptions présentent leurs activités ; aucun résultat chiffré, témoignage, date de réalisation ou détail d’intervention non confirmé n’a été inventé.

Les clients sont initialisés une seule fois dans `data/thermidor.sqlite`. Les modifier ensuite dans l’administration, pas dans les données de départ. Les onglets **Clients** (`/admin/clients`) et **Apps** (`/admin/apps`) permettent chacun de créer, modifier, ordonner, publier/dépublier et supprimer leurs fiches. Les champs français et anglais sont obligatoires. L’image importée est validée, débarrassée de ses métadonnées et convertie en WebP ; maximum 8 Mo et 40 mégapixels en entrée.

Les clients existants restent dans la table `projects`. La table `apps`, indépendante et vide au départ, est créée automatiquement au démarrage. Les pages publiques sont `/clients`, `/en/clients`, `/apps` et `/en/apps`, avec une page de détail par fiche publiée. Les anciennes adresses `/projets` et `/en/projects`, y compris leurs fiches, redirigent définitivement vers Clients. Les anciennes routes d’administration `/admin/projects` restent compatibles.

Les anciens fichiers images non utilisés ne sont pas chargés par le nouveau site. Les médias importés ne sont pas supprimés automatiquement lors de la suppression d’un projet, pour éviter de casser une image réutilisée. Prévoir un nettoyage périodique des fichiers orphelins si nécessaire.

## Emails de contact

Le formulaire envoie deux emails HTML distincts avec le logo intégré en PNG et une alternative texte. L’agence reçoit une notification en français « Vous avez reçu une demande de contact sur Thermidor », avec les coordonnées et le message ; son `Reply-To` pointe vers le visiteur. Une fois cette notification acceptée par SMTP, le visiteur reçoit un remerciement et la copie de sa demande dans la langue du formulaire ; son `Reply-To` pointe vers Thermidor. Il n’y a plus de CC partagé.

Si le serveur SMTP accepte la demande pour Thermidor mais refuse la copie, le formulaire confirme la transmission à l’agence et signale l’échec de la copie. L’acceptation SMTP ne garantit pas la remise finale : vérifier les événements de livraison dans Mailjet pour un envoi réel.

Prévisualisation locale sans envoyer d’email : `node scripts/preview-contact-email.js`. Les fichiers HTML, EML et captures FR/EN sont générés dans `artifacts/email/`.

## Installer sur Coolify

La connexion Google de l’admin est disponible après configuration du client OAuth et de l’adresse autorisée. Voir [le guide Google OAuth](deploy/GOOGLE-OAUTH.md). URI de redirection : `https://thermidor-agence-web.fr/admin/auth/google/callback`.

Pour le VPS géré avec Coolify, suivre [le guide dédié](deploy/COOLIFY.md). Sélectionner le build pack **Docker Compose**, avec **Docker Compose Location** `/compose.coolify.yaml` et le domaine du service `app` **`https://thermidor-agence-web.fr:3000`**. `BASE_URL` reste **`https://thermidor-agence-web.fr`**, sans le port interne.

Le Compose dédié utilise le proxy Coolify, les variables saisies dans son interface et deux volumes persistants pour SQLite et les images. Il ne nécessite pas de fichier `.env` dans le dépôt. Pour valider la construction et la persistance avec Docker local : `node scripts/verify-docker.mjs`.

## Installation Docker autonome (hors Coolify)

Pré-requis : Docker Engine avec Compose, DNS du domaine et de `www` pointant vers le VPS, ports 80/443 accessibles. Le Compose fourni suppose que ces ports sont disponibles. Avec un proxy Nginx/Caddy existant, garder celui-ci et adapter son upstream au service Node au lieu de lancer un second proxy sur les mêmes ports.

1. Copier le projet sur le VPS sans `.env`, `.local`, `node_modules`, `artifacts` ni données de test.
2. Copier `.env.example` vers `.env` et renseigner les paramètres.
3. Générer `ADMIN_PASSWORD_HASH` avec `npm run admin:password` sur une machine équipée de Node 24. La commande masque la saisie et affiche uniquement le hash à copier. Sans Node sur le VPS : construire l’image puis exécuter `docker compose run --rm --no-deps app node scripts/admin-password.js`.
4. Générer un `SESSION_SECRET` avec `openssl rand -hex 32`.
5. Renseigner `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` et `SMTP_FROM`. Le port 587 utilise STARTTLS obligatoire ; le port 465 nécessite `SMTP_SECURE=true`. L’expéditeur doit être autorisé par le serveur mail. Le destinataire reste `contact@thermidor-agence-web.fr` et l’email du visiteur est placé dans `Reply-To`.
6. Le téléphone professionnel 06 16 60 40 28 est affiché dans les mentions légales et les zones de contact avec un lien pour appeler directement. Les mentions légales FR/EN incluent les informations de Martin Rupp-Dahlem EI (SIREN, SIRET, RNE, TVA et adresse), issues de sa fiche Pappers vérifiée le 14 septembre 2026, ainsi que les coordonnées d’OVH SAS. Vérifier le numéro de TVA auprès de l’entreprise. Les variables `LEGAL_COMPANY`, `LEGAL_ADDRESS`, `LEGAL_REGISTRATION` (SIREN), `LEGAL_DIRECTOR` et `LEGAL_HOST` permettent de personnaliser les champs existants ; tout changement d’entreprise ou d’hébergeur nécessite aussi de revoir les autres informations dans `src/views.js`. Relire et adapter la confidentialité aux durées de conservation réellement appliquées à la messagerie.
7. Exécuter `docker compose up -d --build`.

Caddy gère HTTPS, les redirections `www` et la compression gzip/zstd. L’application tourne sans droits root et n’expose aucun port directement dans Compose. Les données et uploads sont stockés dans des volumes persistants. `TRUST_PROXY=1` est prévu pour cet unique proxy ; ne pas utiliser ce réglage si Node est directement exposé à Internet.

Pour une installation Node native, utiliser `HOST=127.0.0.1`, des chemins `DATABASE_PATH`/`UPLOAD_DIR` adaptés et un service systemd. Avec un proxy local, choisir `TRUST_PROXY=loopback`. Le serveur exige HTTPS et des secrets administrateur en mode production.

Après changement du mot de passe administrateur, invalider les sessions déjà ouvertes via SQLite (`DELETE FROM sessions`) si la rotation doit immédiatement révoquer les accès existants. Les sessions expirent après huit heures.

## Sauvegarder et mettre à jour

Sauvegarder ensemble la base SQLite et les médias. Avec Docker, arrêter brièvement `app`, sauvegarder les volumes `thermidor_data` et `thermidor_uploads` avec l’outil de sauvegarde du VPS, puis relancer `app`. Pour une sauvegarde sans arrêt, employer l’API de backup SQLite plutôt qu’une copie isolée du fichier `.sqlite` pendant les écritures WAL. Sauvegarder aussi `.env` dans un stockage privé chiffré. Tester une restauration avant de compter sur ces sauvegardes.

Mettre à jour avec `docker compose up -d --build` après sauvegarde. Ne pas utiliser `docker compose down -v`, qui détruit les volumes. Contrôler `docker compose ps` et `docker compose logs --tail=50 app`. `/healthz` vérifie l’accès à la base ; il ne contrôle pas la délivrabilité SMTP.

## SEO et performance

- URL française et anglaise distincte pour chaque page et chaque projet.
- Titres, descriptions, canonical, hreflang FR/EN et x-default.
- Données structurées Organization, Service et BreadcrumbList selon les pages.
- Sitemap dynamique : les brouillons sont exclus, les clients et apps publiés sont inclus immédiatement.
- Redirection permanente de `/service` vers `/expertises` et des anciennes URL HTML.
- Une seule balise H1 par page ; contenu et liens disponibles sans JavaScript.
- CSS, police variable Manrope sous licence OFL et images servis localement.
- Environ 2,5 Ko de JavaScript public non compressé ; chargement différé des images hors écran.
- Pas de vidéo automatique, de préchargement bloquant, de suivi publicitaire ni de mesure d’audience tiers.

Les balises techniques ne garantissent pas un classement. Après mise en ligne, vérifier les URL réellement indexées de l’ancien site pour compléter la table de redirection et soumettre le sitemap dans Search Console. Le positionnement Lille / France / Europe est intégré aux contenus, sans adresses d’agences fictives.

## Vérification

```sh
npm test
node scripts/verify-browser.js
node scripts/verify-clients-apps.mjs
```

La suite Node vérifie le rendu bilingue, les redirections, les erreurs 404, les protections des formulaires, la connexion administrateur, la publication des brouillons, l’échappement HTML, l’upload d’images et la révocation de session.

La vérification navigateur nécessite le serveur local actif, les identifiants générés par `setup-local.js` et Microsoft Edge installé. Elle vérifie les écrans desktop/mobile, le menu, le formulaire non connecté au SMTP, la connexion admin et l’accessibilité avec axe. Rapports et captures dans `artifacts/qa/`.

La vérification Clients/Apps lance son propre serveur de test sur le port 3147 avec une base en mémoire et nécessite Microsoft Edge. Elle vérifie six largeurs d’écran, la création d’une app, l’import de visuel, la publication, le changement de langue, la suppression et l’accessibilité. Captures dans `artifacts/qa-clients-apps/`.

Les tests SMTP utilisent un transport simulé et n’envoient aucun email. Un envoi réel et la réception dans la boîte de destination restent à vérifier après configuration SMTP. Le déploiement Docker/HTTPS doit également être vérifié sur le VPS ; il n’a pas été exécuté depuis ce workspace.

## Sources visuelles et éditoriales

Références de direction artistique : [Morez](https://morez.co/), [Daima](https://wearedaima.framer.website/), [Ignite](https://igniteagency.com/), [Oroya](https://www.oroya.fr/).

Contenu d’origine : [Thermidor](https://thermidor-agence-web.fr/). Références projet et captures : [SNV](https://www.snv-vetements-pro.fr/), [Maison Charlet](https://maisoncharlet.fr/), [Junaki](https://junaki.fr/). Les sites externes ne sont pas chargés dans des iframes ; chaque projet propose un lien explicite pour les visiter.

Scripts de préparation (facultatifs, avec accès réseau) : `scripts/capture-references.js` et `scripts/prepare-assets.js`. Les assets produits sont déjà présents ; aucune connexion à ces sites n’est nécessaire au fonctionnement du site.
