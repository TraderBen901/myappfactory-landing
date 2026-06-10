# MyAppFactory CMS foundation

This project uses **Sanity Studio** as the headless CMS foundation.

## What is included

- Embedded Studio route: `/studio`
- Sanity config: `sanity.config.ts`
- Sanity CLI config: `sanity.cli.ts`
- Schemas for:
  - `siteSettings`
  - `landingPage`
  - reusable cards, links, stats, process steps, app cards and training levels
- Read client and GROQ queries:
  - `sanity/lib/client.ts`
  - `sanity/lib/queries.ts`
  - `sanity/lib/landing.ts`

## Environment variables

Copy `.env.example` to `.env.local` locally, and configure the same variables in Vercel:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=dwgqm2o3
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

The site still builds without these variables. When they are missing, the Sanity client returns `null` and the current static `messages/*.json` content remains the source of truth.

## Local development

```bash
npm install
npm run dev
```

Open:

- Site: `http://localhost:3000/fr`
- Studio: `http://localhost:3000/studio`

## Content model

Create one `landingPage` document per locale:

- `locale = fr`
- `locale = en`

The schema mirrors the current landing sections:

1. SEO
2. Hero
3. Problem
4. Approach
5. What we build
6. Apps / proof projects
7. Process
8. For who
9. Training / Academy
10. Final CTA

## Integration strategy

This PR intentionally adds the CMS foundation without replacing every visible component yet.

Recommended next step:

1. seed Sanity with the current `messages/fr.json` and `messages/en.json` content;
2. wire one low-risk section first, usually `Training`, with fallback to `next-intl` messages;
3. then migrate the rest section by section.

This avoids breaking the live landing while giving us the admin interface and schema now.
