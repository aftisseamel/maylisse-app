alter table "public"."article" alter column "quantity" set default '0'::smallint;


create or replace function sum_quantity_above(val integer)
returns integer
language sql
as $$
  select sum(quantity) from table "public"."article" where "article"."quantity" > val;
$$;