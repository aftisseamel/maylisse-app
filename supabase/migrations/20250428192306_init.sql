create table article (
    id serial primary key,
    name varchar(255) not null,
    price numeric(18, 2) not null,
    quantity integer not null default 0,
    description text,
    image_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
);

create table client (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(20),
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()                
);

create table delivery_man (
    id serial primary key,
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
    'finished'
);


create table "order" (
    id serial primary key,
    id_client integer references client(id) on delete set null,
    status order_status not null default 'initiated',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    delivery_address text not null,
    id_delivery_man integer references delivery_man(id) on delete set null
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
