AutoChord is a clean, performance‑oriented Next.js site for generating and presenting aligned guitar chords and lyrics with an emphasis on professional UI and stage‑readiness. The project now uses a streamlined navigation, polished CTAs, and a Telegram‑powered contact flow for quick inquiries.

## Quick Start

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Edit the homepage at `app/page.tsx`. Changes hot‑reload automatically.

## Features

- Professional landing and sections (Features, About, Use Cases, Tech Stack)
- Clean navbar with “Get Started” CTA
- 404 page tuned for a polished experience
- Contact form wired to Telegram Bot API
- Tailwind CSS + Next.js App Router

## Telegram Contact Setup

Set the following environment variables (e.g., in `.env.local`) to route contact form messages to your Telegram:

```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

How to find your chat ID:
- Send a message to your bot on Telegram.
- Visit `https://api.telegram.org/bot<token>/getUpdates` and read the `chat.id` from the JSON.

API route: `app/api/contact/route.ts`

## Admin Login & Panel

Simple admin auth is included for a lightweight panel with content editing and sample analytics.

Set these variables in `.env.local`:

```
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
AUTH_SECRET=a_long_random_string
DATABASE_URL=postgres://user:pass@host:port/dbname
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=no-reply@yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Usage:
- Start the app: `npm run dev`
- Visit `/login`, sign in with your credentials
- Admin panel: `/admin`
- Content editor: `/admin/content`

Notes:
- The session cookie is HttpOnly and signed with `AUTH_SECRET`.
- Metrics are demo-only; set `NEXT_PUBLIC_SITE_URL` to your site URL for server fetches in production, or it defaults to `http://localhost:3000` in development.

## Database Migrations

Run database migrations against `DATABASE_URL`:

```
npm run migrate
```

This applies all SQL files in `database/migrations` in order and tracks them in `schema_migrations`. It is safe to run multiple times.

## Deploy on Render

This repo includes a `render.yaml` for one-click deployment (frontend + backend + Postgres).

Steps:
- Push the repository to GitHub.
- In Render, choose New > Blueprint and select the repository.
- Render will use the build and start commands from `render.yaml`.

Local build commands (same as Render):

```bash
npm run build
npm run start
```

The backend service connects to the Render Postgres instance via `DATABASE_URL`.

## Notes on Project Structure

- Frontend: Next.js app in `/app` with Tailwind styling and reusable components in `/components`.
- Optional Backend: Express service in `/backend` with Postgres integration and migrations in `/database/migrations`. Keep this if you plan to use the API and database on Render; otherwise the frontend runs independently.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Helping hand — RAM GAWAS  
[ramgawas55.in](https://ramgawas55.in)
