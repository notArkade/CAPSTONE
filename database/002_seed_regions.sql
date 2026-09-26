-- Version 0.1 region records. No geometry is inserted: do not fabricate boundaries.
insert into public.regions (code, name, region_type, geometry)
values
  ('DL', 'Delhi', 'region', null),
  ('UP', 'Uttar Pradesh', 'region', null)
on conflict (code) do update
set name = excluded.name,
    region_type = excluded.region_type;
