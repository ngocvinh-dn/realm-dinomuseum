# Realm Dino Museum

An immersive 3D dinosaur museum built with React, Vite, Three.js, Cesium, and Supabase.

The project combines a cinematic landing page, a first-person virtual museum, era-specific 3D environments, and a globe-based fossil discovery experience. Content and 3D asset URLs are loaded from Supabase so the frontend can evolve without hardcoding museum data into the UI.

## Highlights

- Cinematic home page with animated storytelling sections and scroll-driven visuals.
- Email/password authentication with Supabase Auth.
- Virtual museum at `/museum` with first-person navigation and interactive fossil gateways.
- Era exploration at `/era/:slug` with revived dinosaur interactions and 3D environment loading.
- Globe experience at `/explore` and archive view at `/archive` powered by Cesium and `fossil_locations`.
- Supabase-backed content services for environments, exhibits, scene assets, and site media.
- Asset prefetching layer to reduce waiting time before entering 3D scenes.

## Tech Stack

- `React 19`
- `Vite 8`
- `react-router-dom`
- `@react-three/fiber` and `@react-three/drei`
- `three`
- `cesium` and `resium`
- `framer-motion`
- `gsap`
- `lenis`
- `Supabase JavaScript client`
- `Tailwind CSS v4`

## Application Routes

- `/`: landing page and entry funnel
- `/museum`: main 3D museum scene
- `/era/:slug`: era-specific immersive scene
- `/explore`: globe-based fossil explorer
- `/archive`: alternate fossil archive globe view

## Project Structure

```text
.
|-- public/
|   |-- audio/                # Ambient audio assets
|   |-- images/               # Dinosaur and specimen images
|   |-- sequences/            # Frame sequences used by animated sections
|   `-- icons/
|-- src/
|   |-- components/
|   |   |-- auth/             # Auth modal and login/register UI
|   |   |-- common/           # Shared animated UI primitives
|   |   |-- home/             # Landing page sections
|   |   |-- layout/           # Navbar, branding, smooth scroll
|   |   |-- museum/           # Museum scene, controls, popups
|   |   `-- scene/            # Era scene effects
|   |-- context/              # Auth context
|   |-- hooks/                # Data and UI hooks
|   |-- lib/                  # Shared Supabase client
|   |-- pages/                # Route-level pages
|   |-- services/             # Supabase data access and asset prefetch
|   `-- utils/                # Small helpers
|-- supabase/
|   |-- migrations/           # Database migration history
|   `-- supabaseclinet/       # Legacy import path that re-exports the shared client
|-- index.html
|-- vite.config.js
`-- package.json
```

## Core Frontend Architecture

### 1. Landing and entry flow

The home page in [src/pages/home.jsx](D:/congnghethongtin/BWD-3DDinoMuseum/src/pages/home.jsx) orchestrates:

- section-based storytelling
- auth modal entry points
- museum asset prefetch while the visitor is still on the landing page
- redirect handling after email confirmation with `?auth=login&confirmed=1`

### 2. 3D museum flow

The museum scene in [src/components/museum/MuseumScene.jsx](D:/congnghethongtin/BWD-3DDinoMuseum/src/components/museum/MuseumScene.jsx):

- loads the main museum environment from Supabase
- exposes interactive fossils that route visitors into era spaces
- warms up era assets in the background once the museum is ready

### 3. Era scenes

[src/pages/EraPage.jsx](D:/congnghethongtin/BWD-3DDinoMuseum/src/pages/EraPage.jsx) loads:

- era metadata from `eras`
- exhibit definitions from `exhibits`
- fossil and revived dinosaur models
- transformation data used by the revive effect

### 4. Data services

The `src/services` layer separates content loading from UI:

- `sceneAssetsService.js`: museum GLB and fossil gateway assets
- `environmentService.js`: era environments
- `exhibitsService.js`: interactive exhibit objects and dinosaur payloads
- `dinosaursService.js`: dinosaur catalog queries
- `siteAssetsService.js`: optional media-driven landing page assets
- `assetPreloader.js`: deduplicated prefetch and in-memory cache

## Supabase Data Dependencies

The frontend expects these tables or equivalent data sources:

- `scene_assets`
- `eras`
- `exhibits`
- `dinosaurs`
- `dinosaur_facts`
- `fossil_locations`
- one of `site_assets`, `museum_assets`, or `media_assets`
- `profiles` for user profile fields added by migrations

Current migrations in `supabase/migrations` show profile-related changes such as:

- `phone`
- `has_ticket`
- `updated_at`

## Environment Variables

Create a local `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Notes:

- The app prefers `VITE_SUPABASE_PUBLISHABLE_KEY` and falls back to `VITE_SUPABASE_ANON_KEY`.
- `vite.config.js` also supports fallback names such as `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`, but the recommended convention for this app is still `VITE_*`.
- When changing environment variables on Vercel, redeploy the project so the frontend is rebuilt with the new values.

## Local Development

### Prerequisites

- Node.js 18+
- npm
- A Supabase project with the expected tables and public asset URLs

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5174
```

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

This project is set up for static frontend deployment on platforms like Vercel.

Recommended deployment steps:

1. Import the repository into Vercel.
2. Add the Supabase environment variables in Project Settings.
3. Trigger a fresh deployment after env changes.
4. Verify that Supabase-backed routes load correctly in production.

## Important Implementation Notes

- The app uses `BrowserRouter`, so non-root route refresh behavior depends on host rewrite support.
- Cesium is enabled through `vite-plugin-cesium`.
- A Cesium Ion token is currently initialized in [src/main.jsx](D:/congnghethongtin/BWD-3DDinoMuseum/src/main.jsx). Treat that as deployment-sensitive configuration.
- `src/lib/supabaseClient.js` contains guarded client initialization so the app does not hard-crash when public env values are missing.
- `supabase/supabaseclinet/supabase-clinet.ts` exists as a compatibility re-export for older imports.

## Suggested Next Cleanup

- Move the Cesium Ion token into environment-based configuration.
- Standardize Vietnamese text encoding across several source files.
- Remove the legacy `/archive` page if `/explore` fully replaces it.
- Add automated tests for auth flow and route-level rendering.

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```
