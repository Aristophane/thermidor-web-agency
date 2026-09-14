# Connexion Google à l’administration

URL de redirection de production, à copier exactement dans le client OAuth Google :

```text
https://thermidor-agence-web.fr/admin/auth/google/callback
```

## Google Cloud

1. Ouvrir [Google Auth Platform](https://console.cloud.google.com/auth/clients), puis sélectionner ou créer le projet Thermidor.
2. Renseigner l’identité de l’application et son audience. Si le projet est en mode test, ajouter l’adresse Google de l’administrateur aux utilisateurs de test. Une audience interne convient uniquement si les comptes autorisés appartiennent à la même organisation Google Workspace.
3. Créer un client OAuth de type **Application Web**.
4. Dans **URI de redirection autorisés**, ajouter l’URL ci-dessus, sans slash final et sans port `:3000`. Le flux est géré par le serveur : aucune origine JavaScript n’est nécessaire.
5. Récupérer l’ID client et le secret client. Saisir le secret uniquement dans les variables d’exécution du serveur, jamais dans le dépôt ou dans du JavaScript public.

## Coolify

Le fichier `compose.coolify.yaml` transmet ces variables au service `app` :

```dotenv
BASE_URL=https://thermidor-agence-web.fr
GOOGLE_CLIENT_ID=ID_DU_CLIENT.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=SECRET_DU_CLIENT
GOOGLE_ADMIN_EMAIL=adresse-du-compte-google-autorise@example.com
```

`GOOGLE_ADMIN_EMAIL` doit être l’adresse exacte renvoyée par Google, pas un alias de réception. Si elle est vide, l’application utilise `ADMIN_EMAIL`. Un autre compte, même du même domaine, est refusé. L’adresse autorisée n’est pas affichée sur la page de connexion.

Conserver `SESSION_SECRET`. `ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH` conservent la connexion par mot de passe lorsqu’ils sont renseignés. Le hash peut être vide si Google est entièrement configuré. Le serveur refuse de démarrer en production sans méthode d’authentification configurée.

Déployer le code et ses dépendances, enregistrer les variables, puis redéployer le service. Sur `/admin/login`, le bouton **Se connecter avec Google** apparaît uniquement si l’ID client, le secret et l’adresse autorisée sont configurés. L’installation du code seule n’active pas Google sur le serveur de production.

## Vérification

`npm test` vérifie le flux et les refus avec des jetons signés localement, validés par la bibliothèque Google. `node scripts/verify-google-login.mjs` vérifie le parcours navigateur et les cookies lors d’un retour depuis une origine Google simulée, sans utiliser de compte réel. Ce contrôle nécessite Microsoft Edge et le port local 3151 disponible. Les captures sont dans `artifacts/qa-google-login/`. Après activation, effectuer aussi les vérifications réelles ci-dessous.

- Cliquer sur le bouton Google, choisir le compte autorisé et vérifier l’accès à Clients et Apps.
- Se déconnecter et vérifier que l’admin demande à nouveau une connexion.
- Un autre compte Google doit être refusé, sans session administrateur.
- Pour `redirect_uri_mismatch`, vérifier `BASE_URL` et l’URI Google caractère par caractère. Ajouter une URI distincte pour la préproduction ou le développement local.

Le serveur utilise le flux Authorization Code avec PKCE, un état aléatoire lié au navigateur et consommé une seule fois, et un nonce. La bibliothèque officielle Google valide la signature, l’émetteur, l’audience et l’expiration du jeton d’identité. L’application vérifie ensuite l’adresse email validée et la liste d’accès limitée à un compte. Les tentatives expirent après dix minutes ; la session locale expire après huit heures. Aucun jeton Google d’accès ou de renouvellement n’est conservé. Les formulaires admin restent protégés par origine et jeton CSRF.

Référence : [Google OpenID Connect, configuration et flux serveur](https://developers.google.com/identity/openid-connect/openid-connect).
