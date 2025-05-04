
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
    quantity integer not null default 0,
    description text,
    image_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
);

create table client (
    id serial primary key,
    name varchar(255) not null unique,
    email varchar(255) not null,
    phone varchar(20),
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
);

create table delivery_man (
    id serial primary key,
    pseudo varchar(255) not null unique,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(20),
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
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
    pseudo varchar(255) references delivery_man(pseudo) on delete set null,
    name_client varchar(255) not null references client(name) on delete set null,
    description_order text not null
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

