# Déployer Thermidor avec Coolify

Utiliser **`compose.coolify.yaml`** dans le dépôt. Il construit le `Dockerfile`, démarre Node sur le port interne 3000 et déclare deux volumes persistants. Le proxy de Coolify gère l’accès public et HTTPS.

## 1. Créer l’application

Pousser le projet dans votre dépôt Git, puis dans Coolify :

1. Ouvrir le projet et ajouter une ressource depuis ce dépôt (public ou privé).
2. Choisir le build pack **Docker Compose**.
3. Configurer **Base Directory** : `/`.
4. Configurer **Docker Compose Location** : `/compose.coolify.yaml`.
5. Charger le fichier Compose. Garder le mode Compose normal, avec le proxy Coolify activé.

Le dossier de build est la racine du dépôt. Il doit contenir `Dockerfile`, `package.json`, `package-lock.json`, `src/`, `public/` et `scripts/admin-password.js`. Les fichiers privés locaux (`.env`, `.local/`, `data/`, `artifacts/`) sont exclus de Git ou du contexte Docker. Les données de la version locale ne sont pas copiées dans l’image.

Le fichier `compose.yaml` concerne l’installation autonome avec Caddy ; sélectionner explicitement **`compose.coolify.yaml`** dans Coolify.

## 2. Domaine

Dans les domaines du service **app**, saisir :

```text
https://thermidor-agence-web.fr:3000
```

Ici, `:3000` indique à Coolify le port **interne** de destination. L’URL publique reste **https://thermidor-agence-web.fr**, sur le port HTTPS standard. Faire pointer le DNS vers le VPS. Configurer une redirection vers ce domaine si vous utilisez aussi `www`.

Définir `BASE_URL=https://thermidor-agence-web.fr` **sans `:3000`** et sans chemin supplémentaire. Elle sert aux URL canoniques et à la vérification d’origine des formulaires. Pour un domaine de préproduction, adapter à la fois le domaine Coolify et `BASE_URL` avant de déployer.

## 3. Variables d’environnement

Coolify détecte les variables présentes dans le Compose. Les renseigner comme variables d’exécution ; les secrets ne sont pas nécessaires pendant le build.

| Variable | Valeur |
| --- | --- |
| `BASE_URL` | `https://thermidor-agence-web.fr` |
| `ADMIN_EMAIL` | `contact@thermidor-agence-web.fr`, ou votre email administrateur |
| `ADMIN_PASSWORD_HASH` | Hash généré ci-dessous, à copier intégralement |
| `SESSION_SECRET` | Valeur aléatoire d’au moins 32 caractères, stable entre redéploiements |
| `SMTP_HOST` | Hôte de votre serveur mail |
| `SMTP_PORT` | `587` pour STARTTLS, ou `465` pour TLS direct |
| `SMTP_SECURE` | `false` avec 587, `true` avec 465 |
| `SMTP_USER` | Identifiant SMTP |
| `SMTP_PASS` | Mot de passe SMTP |
| `SMTP_FROM` | `Thermidor <contact@thermidor-agence-web.fr>` si cet expéditeur est autorisé |
| `LEGAL_COMPANY` | Dénomination juridique |
| `LEGAL_ADDRESS` | Adresse de l’entreprise |
| `LEGAL_REGISTRATION` | Informations d’immatriculation |
| `LEGAL_DIRECTOR` | Responsable de publication |
| `LEGAL_HOST` | Identité et coordonnées de l’hébergeur |

Les trois variables marquées `:?` dans Compose sont obligatoires : URL publique, hash du mot de passe et secret de session. Le serveur vérifie aussi la configuration de production au démarrage.

Générer le hash du mot de passe sur la machine de développement, avec Node 24 :

```sh
npm run admin:password
```

La saisie du mot de passe est masquée. Copier la valeur après `ADMIN_PASSWORD_HASH=` dans Coolify. L’authentification attend un hash, pas le mot de passe en clair. Le mot de passe local déjà communiqué n’est pas intégré dans l’image.

Générer le secret de session :

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Le formulaire envoie deux emails distincts : une notification « Vous avez reçu une demande de contact sur Thermidor » à `contact@thermidor-agence-web.fr`, puis un remerciement avec la copie du message au visiteur. Les deux incluent le logo Thermidor et une alternative texte. Le remerciement reprend la langue du formulaire ; la notification de l’agence est en français. `Reply-To` permet à chaque destinataire de répondre à l’autre. `ADMIN_EMAIL` change uniquement l’identifiant de connexion. Sans SMTP configuré, le site fonctionne et le formulaire affiche un échec explicite. Après configuration, vérifier un envoi réel et sa réception dans les deux boîtes. Aucune variable supplémentaire n’est nécessaire.

## 4. Stockage et santé

Les volumes sont déjà déclarés dans Compose :

| Volume | Destination dans le conteneur | Contenu |
| --- | --- | --- |
| `thermidor_data` | `/app/data` | Base SQLite, projets et sessions administrateur |
| `thermidor_uploads` | `/app/public/uploads` | Images importées dans l’administration |

Conserver ces deux montages lors des redéploiements. Coolify donne aux volumes des noms propres à la ressource. Vérifier leur présence dans **Persistent Storage**. Utiliser ces volumes nommés tels quels ; avec un bind mount existant, le dossier hôte doit être accessible en écriture par UID/GID **1000:1000** (utilisateur `node`).

Le `Dockerfile` fournit un healthcheck Node sur `/healthz`, avec délai initial de 20 secondes. Il vérifie aussi l’accès SQLite. Aucun `curl` ou `wget` n’est nécessaire à ce healthcheck. Laisser Coolify utiliser celui de l’image.

Garder une seule instance sur ce VPS pour cette base SQLite locale. Programmer une sauvegarde de la base et des images ; les volumes persistants ne constituent pas une sauvegarde. Pour une copie simple et cohérente, arrêter brièvement l’application, sauvegarder les deux volumes et redémarrer. Pour une sauvegarde à chaud, utiliser l’API de backup SQLite.

## 5. Déployer et contrôler

1. Enregistrer les variables et cliquer sur **Deploy**.
2. Vérifier que le service est sain et que les logs indiquent le démarrage de Thermidor.
3. Ouvrir `/`, `/en`, `/admin/login` et `/sitemap.xml` sur le domaine.
4. Se connecter avec l’email administrateur et le mot de passe choisi lors de la génération du hash.
5. Créer un brouillon et importer une image, puis redéployer pour confirmer leur conservation sur votre installation.
6. Vérifier le formulaire après configuration SMTP et compléter les mentions légales avant publication.

**En cas d’erreur :** `502`/service indisponible → vérifier le domaine Coolify avec `:3000` et le healthcheck ; erreur d’origine lors de l’envoi d’un formulaire → vérifier que `BASE_URL` correspond exactement à l’URL publique ; `EACCES` → vérifier les droits des montages ; erreur SMTP → vérifier les identifiants, le mode TLS et les connexions sortantes du VPS.

## Vérifier l’image en local

```sh
node scripts/verify-docker.mjs
```

Nécessite Docker démarré. Le script valide Compose, construit l’image, lance un conteneur isolé sans port public, vérifie HTTP/SQLite/Sharp et les permissions, puis recrée le conteneur pour vérifier les volumes. Il ne lit pas les secrets de votre `.env` et ne touche pas aux volumes de production. Les conteneurs et volumes temporaires créés par ce script sont supprimés à la fin ; l’image `thermidor:coolify-check` reste disponible.

Documentation officielle : [build pack Docker Compose](https://coolify.io/docs/applications/build-packs/docker-compose), [domaines et variables Compose](https://coolify.io/docs/knowledge-base/docker/compose), [stockage persistant](https://coolify.io/docs/knowledge-base/persistent-storage), [healthchecks](https://coolify.io/docs/knowledge-base/health-checks).
