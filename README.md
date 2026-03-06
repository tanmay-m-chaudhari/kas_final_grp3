# RecipeHub — Next.js SSR Recipe Sharing Platform

A server-side rendered recipe browsing platform built with Next.js 14 App Router.

## Features
- SSR homepage with search and category filtering via URL params
- SSG recipe detail pages (`generateStaticParams`)
- JSON REST API at `/api/recipes`
- Responsive Tailwind CSS UI

## Tech Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS

## Run (Production)

```bash
npm install
npm run build
npm run start
# → http://localhost:3000
```

> **Important:** Use `npm run build && npm run start`, NOT `npm run dev`.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | All recipes |
| GET | `/api/recipes?id=1` | Single recipe |
| GET | `/api/recipes?q=pasta` | Search |
| GET | `/api/recipes?category=Italian` | By category |
