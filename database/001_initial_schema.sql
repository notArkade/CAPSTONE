-- EquiMap Version 0.1: run in the Supabase SQL Editor.
-- Supabase supports extensions through the extensions schema.
create extension if not exists postgis with schema extensions;

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  region_type text not null default 'region',
  -- Kept nullable until authoritative, licensed boundary GeoJSON is imported.
  geometry extensions.geometry(Geometry, 4326),
  created_at timestamptz not null default now(),
  constraint regions_code_format check (code ~ '^[A-Z0-9_-]+$'),
  constraint regions_name_not_blank check (length(trim(name)) > 0)
);

create index if not exists regions_geometry_gix on public.regions using gist (geometry);

-- This API uses a backend-only Supabase key. When browser/user access is added,
-- enable and define Row Level Security policies before exposing this table.
