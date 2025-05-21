# Maylisse App

Application de gestion de livraison et de commandes.

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)
- Un compte Supabase (pour la base de données)

## Dépendances

### Dépendances principales
```bash
npm install @headlessui/react @heroicons/react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @supabase/auth-helpers-nextjs @supabase/supabase-js class-variance-authority clsx jspdf lucide-react next react react-dom tailwind-merge tailwindcss-animate
```

### Dépendances de développement
```bash
npm install -D @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest @types/node @types/react @types/react-dom @types/testing-library__react autoprefixer eslint eslint-config-next identity-obj-proxy jest jest-environment-jsdom postcss tailwindcss ts-jest typescript
```

## Installation

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd maylisse-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. **Configuration de Supabase**

Pour configurer l'authentification et la base de données avec Supabase, suivez le guide officiel : [Configuration de Supabase avec Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

Étapes principales :
- Créer un projet sur [Supabase](https://supabase.com)
- Installer les packages nécessaires :
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```
- Configurer le middleware pour l'authentification
- Configurer les routes d'authentification
- Mettre en place la gestion des sessions

### Gestion des Rôles

Les rôles utilisateurs (admin, delivery_man) sont gérés directement dans Supabase :

1. **Accéder à l'interface Supabase**
   - Allez dans votre projet Supabase
   - Naviguez vers "Authentication" > "Users"

2. **Attribuer un rôle**
   - Sélectionnez l'utilisateur
   - Dans les métadonnées de l'utilisateur, ajoutez :
     ```json
     {
       "role": "admin"  // ou "delivery_man"
     }
     ```

3. **Rôles disponibles**
   - `admin` : Accès complet à toutes les fonctionnalités
   - `delivery_man` : Accès limité à l'interface livreur

5. **Migrations de la base de données**

Exécutez les migrations suivantes dans l'ordre dans l'éditeur SQL de Supabase :

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table des clients
create table client (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des articles
create table article (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price decimal not null,
  stock integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des livreurs
create table livreur (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des commandes
create table "order" (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references client(id),
  livreur_id uuid references livreur(id),
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des articles de commande
create table order_article (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references "order"(id),
  article_id uuid references article(id),
  quantity integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

6. **Lancer l'application en mode développement**
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure du Projet

```
app/
├── (admin)/                    # Section administration
│   ├── article/               # Gestion des articles
│   ├── order/                 # Gestion des commandes
│   ├── client/                # Gestion des clients
│   ├── delivery_man/          # Gestion des livreurs
│   └── ...
├── ready_to_deliever/         # Commandes prêtes à livrer
└── ...

components/                     # Composants réutilisables
datas/                         # Données de test
```

## Tests

Pour exécuter les tests :
```bash
npm test
```

Pour exécuter les tests en mode watch :
```bash
npm run test:watch
```

## Déploiement

1. **Build de l'application**
```bash
npm run build
```

2. **Démarrage en production**
```bash
npm start
```

## Technologies Utilisées

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Jest (tests)
- Testing Library

## Fonctionnalités Principales

- Gestion des clients
- Gestion des commandes
- Gestion des articles
- Gestion des livreurs
- Interface d'administration
- Système d'authentification
- Génération de PDF
- Recherche et filtrage

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
