# EquiMap — Version 0.1

EquiMap is an early foundation for an urban inequality exploration and decision-support platform. This release establishes a simple map experience and a small region API; it makes no claims about access to services or inequality.

**Current geographic scope:** Delhi (`DL`) and Uttar Pradesh (`UP`). Regions are data records, so additional states can be added later without changing route structure.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Leaflet / React-Leaflet
- Backend: Python, FastAPI, Uvicorn, Pydantic
- Database: Supabase PostgreSQL and PostGIS
- Map tiles: OpenStreetMap

## Structure

```text
frontend/                 React map application
backend/app/              FastAPI routes, schemas, configuration, DB service
database/                 Supabase SQL setup and seed scripts
data/boundaries/          Optional, licensed GeoJSON boundary files
docs/                     Future project documentation
```

## Prerequisites

- Node.js 18+
- Python 3.11+
- A Supabase account and project

No local PostgreSQL, Docker database, or paid maps API is required.

## Supabase setup

1. Create an account at [Supabase](https://supabase.com), then create a new project.
2. In the project dashboard, open **Project Settings → API**. Copy the Project URL.
3. For this backend-only integration, obtain a server-side key from the API settings (a `service_role` key, or a Supabase secret key with equivalent server-only access). Never put it in `frontend/.env`, source code, or a public repository.
4. In the Supabase **SQL Editor**, run [001_initial_schema.sql](database/001_initial_schema.sql), then [002_seed_regions.sql](database/002_seed_regions.sql).
5. Verify **Table Editor → regions** contains `DL / Delhi` and `UP / Uttar Pradesh`. `geometry` is intentionally null in Version 0.1.
6. Copy `backend/.env.example` to `backend/.env` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are reserved for a future browser feature; they are not needed now. If they are used later, only the public anonymous key may appear in a frontend environment file. The service-role key and database password must remain backend-only.

PostGIS is enabled by the first SQL script using `create extension if not exists postgis`. If the project role cannot enable it, use Supabase Dashboard → Database → Extensions to enable **PostGIS**, then rerun the script.

When user-facing database operations are introduced, enable Row Level Security and add narrowly scoped policies before allowing browser access.

## Local configuration and start

From the repository root:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` with the Supabase values. `frontend/.env` can retain `VITE_API_URL=http://localhost:8000`.

Install and run the backend:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt
Set-Location backend
./.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

In another terminal, install and run the frontend:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open the local Vite URL (normally `http://localhost:5173`).

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Returns `{"status":"ok","service":"EquiMap backend"}` |
| `GET /api/regions` | Reads supported regions from Supabase (`id` and `code` are stable values such as `DL`) |
| `GET /api/regions/{region_id}` | Reads one region by its code, e.g. `DL` |

Verify the backend and database after setup:

```powershell
Invoke-RestMethod http://localhost:8000/api/health
Invoke-RestMethod http://localhost:8000/api/regions
Invoke-RestMethod http://localhost:8000/api/regions/DL
```

The first must work without Supabase credentials. The region calls prove FastAPI can read the seeded Supabase table. Configuration problems return a clear `503`; upstream Supabase failures return `502`.

## Map and boundaries

The map uses live OpenStreetMap tiles with Leaflet zoom and pan. Selecting Delhi, Uttar Pradesh, or All changes the viewport. The app uses small data-driven viewport metadata while no boundary file exists, so it remains functional without invented shapes.

To add a real boundary layer later, place small, legally redistributable files at:

```text
data/boundaries/delhi.geojson
data/boundaries/uttar_pradesh.geojson
```

Document the authoritative source, date, license, and any processing in this README before committing a boundary. Import the verified GeoJSON into `regions.geometry` as EPSG:4326, using `ST_GeomFromGeoJSON` (and `ST_SetSRID`) in Supabase. Do not add random datasets or fabricated coordinates. No boundary data is bundled in Version 0.1, so no boundary source/license applies yet. OpenStreetMap tiles are used under the [OpenStreetMap copyright and licence terms](https://www.openstreetmap.org/copyright).

## Git

The root `.gitignore` excludes credentials, build output, virtual environments, database dumps, generated models, and local raw/processed datasets while retaining `.env.example` and intentional small geographic files. Before committing, inspect `git status` and confirm no `.env` or key appears.

## Intentionally not implemented

Version 0.1 has no ML or AI, accessibility/vulnerability scores, citizen reports, authentication, simulations, geocoding, routing, dashboards, charts, or real healthcare, education, transportation, or emergency-service datasets. The disabled layer/search controls and legend are clearly marked as future UI placeholders.

Future modules can build on the generic `regions` table, a PostGIS geometry column, isolated backend DB access, and the frontend API service: facilities, population, analysis, and reporting can be added separately without rewriting this foundation.
