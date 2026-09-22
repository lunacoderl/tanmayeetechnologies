# tanmayeetechnologies

Enterprise Commercial Cooling & Cold Storage Digital Platform for **Tanmayee Technologies** — Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers and Rockwell Commercial Refrigerators Authorized Sales & Service Distributors, PM Palem, Madhurawada, Visakhapatnam.

---

## 🏗️ Architecture Overview

A high-performance TypeScript monorepo powered by **Turborepo**:

```text
tanmayeetechnologies-platform/
├── apps/
│   ├── web/               # Next.js 15 Storefront (Port 3000)
│   │                      # Live catalogue, B2B Quotatio engine, animations
│   └── admin/             # Next.js 15 Enterprise CMS (Port 3001)
│                          # Product manager, Quotations desk, Offers studio
├── services/
│   └── api/               # Express.js REST API & PostgreSQL backend (Port 4000)
├── packages/
│   ├── config/            # Company constants, Google Maps, branding
│   ├── database/          # 155-Product Seed Catalog, schemas, migrations
│   ├── types/             # Shared TypeScript schemas & interfaces
│   ├── validation/        # Zod validation schemas
│   └── seo/               # Schema.org Product JSON-LD & meta tags
├── actors/
│   └── product-catalog-actor/ # Apify Actor for automated spec & image extraction
├── vercel.json            # Vercel deployment configuration (Frontend)
├── render.yaml            # Render Blueprint deployment configuration (Backend)
└── .gitignore             # Strict exclusion for .env, secrets, and node_modules
```

---

## 🚀 Deployment

### 1. Frontend Deployment (Vercel)
The public storefront (`apps/web`) is configured for deployment on **Vercel** via [`vercel.json`](./vercel.json):

1. Import the repository in [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**.
3. Build Command: `npx turbo run build --filter=@tanmayee/web...`
4. Output Directory: `apps/web/.next`
5. Configure Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://tanmayee-api.onrender.com/api`)
   - `NEXT_PUBLIC_SITE_URL`: `https://tanmayeetechnologies.com`

### 2. Backend Deployment (Render)
The API service (`services/api`) is configured for deployment on **Render** via [`render.yaml`](./render.yaml):

1. Connect your repository to [Render Blueprints](https://render.com).
2. Render detects `render.yaml` and spins up the Node.js web service `tanmayee-api`.
3. Provide environment values:
   - `SUPABASE_URL`: Your Supabase PostgreSQL Project URL
   - `SUPABASE_ANON_KEY`: Supabase Public Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key
   - `DATABASE_URL`: Direct PostgreSQL Connection URI

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start all services concurrently
npm run dev
```

- **Public Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Management Console**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## ❄️ Key Features
- **155 Commercial Products**: 58 Blue Star HVAC units + 97 Rockwell commercial refrigeration units.
- **100% Genuine Photography**: Zero mock images, verified manufacturer CDN assets.
- **Live B2B Quotatio Engine**: 4-stage animated procurement engine connecting with direct WhatsApp desk (`093901 15553`).
- **Interactive Visuals**: Shimmering skeleton loaders, scroll reveals, and floating action dock.
- **Admin Offers Studio**: Complete CRUD control over volume discounts, tiered pricing, and permanent/time-limited promotions.
- **Google Maps Showroom**: Direct deep-links to the registered showroom at Plot SFS MIG-131, PM Palem, Madhurawada, Visakhapatnam.

---

## 👥 Contributors

- **Jagadhesh Bellane** ([@lunacoderj](https://github.com/lunacoderj)) — Lead Architect & Contributor (`jagadheshbellane@gmail.com`)
- **Tanmayee Technologies** ([@lunacoderl](https://github.com/lunacoderl)) — Project Repository & Commercial Principal

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for full contribution details.
