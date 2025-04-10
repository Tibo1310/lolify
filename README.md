# Lolify

Un réseau social basé sur League of Legends.

## Description

Lolify est un réseau social permettant aux joueurs et fans de League of Legends de partager du contenu, d'interagir via des commentaires et des likes, et de créer une communauté active autour du jeu.

### Fonctionnalités principales
- Inscription et connexion des utilisateurs
- Publication d'articles
- Commentaires sur les publications
- Système de "likes"
- Navigation et filtrage des articles

## Structure du Projet

Le projet est organisé en monorepo avec deux parties principales :

### Backend (Serveur GraphQL)
- Apollo Server
- Prisma ORM
- GraphQL Codegen
- Authentification JWT
- TypeScript en mode strict

### Frontend (Client)
- React
- Apollo Client
- GraphQL Codegen pour les hooks/types
- TypeScript en mode strict
- Interface utilisateur responsive

## Modèles de Données

### Utilisateur
- ID
- Nom d'utilisateur
- Email
- Mot de passe (hashé)
- Date d'inscription
- Avatar (optionnel)
- Articles publiés
- Commentaires
- Likes

### Article
- ID
- Titre
- Contenu
- Date de création
- Auteur
- Commentaires
- Likes

### Commentaire
- ID
- Contenu
- Date de création
- Auteur
- Article associé

### Like
- ID
- Utilisateur
- Article associé
- Date

## Prérequis

- Node.js (v16+)
- npm ou yarn

## Installation

### Configuration commune
```bash
# Cloner le dépôt
git clone https://github.com/Tibo1310/lolify.git
cd lolify
```

### Backend
```bash
# Naviguer vers le dossier du serveur
cd server

# Installer les dépendances
npm install

# Démarrer le serveur
npm run dev
```

### Frontend
```bash
# Naviguer vers le dossier du client
cd client

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev
```
### Prisma Studio
```bash
# Naviguer vers le dossier serveur
cd server

# Lancer prisma studio
npx prisma studio
```

## Utilisation

- Accédez à l'application via `http://localhost:[PORT]`
- Créez un compte utilisateur
- Connectez-vous pour accéder à toutes les fonctionnalités
- Explorez les articles, créez vos propres publications, commentez et interagissez avec la communauté

## Architecture GraphQL

### Queries principales
- `me`: Informations sur l'utilisateur connecté
- `users`: Liste des utilisateurs
- `user`: Détails d'un utilisateur spécifique
- `articles`: Liste des articles avec filtrage
- `article`: Détail d'un article spécifique

### Mutations principales
- `register`: Inscription d'un nouvel utilisateur
- `login`: Connexion d'un utilisateur
- `createArticle`: Création d'un nouvel article
- `updateArticle`: Mise à jour d'un article
- `deleteArticle`: Suppression d'un article
- `addComment`: Ajout d'un commentaire
- `toggleLike`: Ajouter/Retirer un like

## Standards de Code

- TypeScript en mode strict obligatoire
- Pas d'utilisation du type `any`
- Pas de pratiques telles que `as unknown as Something`
- Tests unitaires pour les fonctionnalités critiques
- ESLint et Prettier pour le formatage du code