create extension if not exists "wrappers" with schema "extensions";


alter table "public"."article" drop column "categorie";

alter table "public"."article" add column "name" article_category not null;


