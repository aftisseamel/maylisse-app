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

Un livreur ne pourra utiliser son compte créé jusqu'à ce que son mail soit créé grâce à l'admin dans la page create_delivery_man.

Les rôles utilisateurs (admin, delivery_man) sont gérés directement dans Supabase :

1. **Accéder à l'interface Supabase**
   - Allez dans votre projet Supabase
   - Naviguez vers "Authentication" > "Users"
   - prendre l'uuid

2. **Attribuer un rôle**
   - Sélectionnez l'utilisateur dans la table des profile grace à son uuid et changer son role


3. **Rôles disponibles**
   - `admin` : Accès complet à toutes les fonctionnalités
   - `delivery_man` : Accès limité à l'interface livreur

5. **Migrations de la base de données**

Exécutez les migrations suivantes dans l'ordre dans l'éditeur SQL de Supabase :

```sql

-- Create a table for public profiles
create type role_profile as enum (
  'admin',
  'delivery_man'
);

create table profiles (
  role_profile role_profile not null default 'delivery_man',
  id uuid references auth.users on delete cascade not null primary key
);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


create table article (
    id serial primary key,
    name varchar(255) not null unique,
    price numeric(18, 2) not null,
    quantity bigint not null default 0,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
);

create table client (
    id serial primary key,
    name varchar(255) not null unique,
    email varchar(255) not null,
    phone varchar(20),
    address_client text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
);

create type delivery_man_status as enum (
    'available',
    'unavailable'
);

create table delivery_man (
    id serial primary key,
    pseudo_delivery_man varchar(255) not null unique,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(20),
    address_delivery_man text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    status delivery_man_status not null default 'unavailable'                
);

create type order_status as enum (
    'initiated',
    'preparation',
    'prepared',
    'delivering',
    'delivered',
    'finished',
    'canceled'
);


create table "order" (
    id serial primary key,
    status order_status not null default 'initiated',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    delivery_address text not null,
    pseudo_delivery_man varchar(255) references delivery_man(pseudo_delivery_man) on delete set null,
    name_client varchar(255) not null references client(name) on delete set null,
    description_order text not null,
    comment_order_deliveryMan text 
);



create table order_article (
    id_order integer references "order"(id) on delete set null,
    id_article integer references article(id) on delete set null,
    quantity integer not null default 0,
    price numeric(18, 2) not null default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (id_order, id_article)

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
