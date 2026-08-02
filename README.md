# Travel Tracker

A desktop-first web app for “country counters” — track visited, lived, and wishlist countries, see your progress toward 100, and save favorite places by location.

---

## What accounts you need (and why)

This app uses four services. Each does one job. You need all of them for a live, working product.

| Service | What it does for you | Why we use it | Cost to start |
|---------|----------------------|---------------|---------------|
| **GitHub** | Stores your code and version history | Every push can trigger a deploy; you can roll back changes and collaborate | Free |
| **Vercel** | Hosts the website (runs the Next.js app on the internet) | Built for Next.js — connect a GitHub repo and get a live URL in minutes | Free tier |
| **Clerk** | Handles sign-in (email + Google) | Building auth yourself is slow and risky; Clerk manages passwords, sessions, and security | Free tier |
| **Postgres** (via Vercel Storage / Neon) | Stores your app data in a database | Countries, which ones each user visited, and saved favorites need persistent storage | Free tier |

### How they work together

```
You write code locally
        ↓
   Push to GitHub
        ↓
   Vercel builds & hosts the site  ←──  Clerk checks who is signed in
        ↓
   App reads/writes data  ←──  Postgres stores countries, user progress, favorites
```

- **GitHub** never sees your users or their travel data. It only holds source code.
- **Vercel** runs the app but does not store your travel data — that lives in Postgres.
- **Clerk** knows who is signed in (email, name, profile). It does **not** store which countries you visited.
- **Postgres** stores everything specific to the app: country list, your visited/lived/want flags, and favorites.

---

## What data lives where

| Data | Stored in | Example |
|------|-----------|---------|
| Your password / Google login | Clerk | “adam@email.com signed in with Google” |
| User ID (anonymous string) | Clerk + Postgres | `user_2abc123` links your Clerk account to your rows in the database |
| Country reference list (~195 countries) | Postgres | `US → United States → North America` |
| Your visited / lived / want countries | Postgres | “User X marked France as visited” |
| Your saved restaurants, hotels, etc. | Postgres | “Café de Flore, Paris, France” |

Clerk and Postgres are linked only by the **Clerk user ID** — a string like `user_2abc123`. The app never stores passwords in Postgres.

---

## One-time setup

### 1. GitHub — store the code

1. Create a repo at [github.com/new](https://github.com/new) (e.g. `travel-tracker`).
2. From this folder, push the code:

```powershell
cd "C:\Users\adamv\Adam Coding\travel-tracker"
git init
git add .
git commit -m "Initial Travel Tracker MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/travel-tracker.git
git push -u origin main
```

### 2. Clerk — sign-in for users

1. Create an app at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Enable **Email** and **Google** as sign-in methods.
3. Copy your keys from **API Keys** in the Clerk dashboard.
4. Create `.env.local` in this folder (copy from `.env.example`):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

The `NEXT_PUBLIC_*` keys are safe to expose in the browser (they’re designed for that). The `CLERK_SECRET_KEY` must stay private — never commit it to GitHub.

### 3. Postgres — store app data

1. In the [Vercel dashboard](https://vercel.com), open your project (or create one in step 4 first).
2. Go to **Storage** → **Create Database** → choose **Postgres** (powered by Neon).
3. Connect it to your project. Vercel adds `POSTGRES_URL` automatically to your project env vars.
4. For **local development**, copy that connection string into `.env.local`:

```env
POSTGRES_URL=postgres://...
```

Postgres is a standard SQL database. We use it because user progress and favorites must survive after the user closes the browser — unlike Clerk, which only handles identity.

### 4. Vercel — host the live site

1. At [vercel.com/new](https://vercel.com/new), **Import** your GitHub repo.
2. Vercel auto-detects Next.js. Add the same env vars from `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `POSTGRES_URL` (often added automatically if you linked Storage)
   - The four `NEXT_PUBLIC_CLERK_*_URL` vars
3. Deploy. You get a URL like `travel-tracker.vercel.app`.

Every push to `main` redeploys automatically.

### 5. Initialize the database

Run once locally (with `POSTGRES_URL` in `.env.local`) or via Vercel’s terminal:

```powershell
npm run db:migrate   # creates tables
npm run db:seed      # loads ~195 countries
```

- **migrate** — creates the `countries`, `user_countries`, and `favorites` tables.
- **seed** — fills the country list. User data is created when people sign in and use the app.

---

## Run locally

```powershell
cd "C:\Users\adamv\Adam Coding\travel-tracker"
npm install
# ensure .env.local has Clerk + POSTGRES_URL keys
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## NPM scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build (what Vercel runs) |
| `npm run db:migrate` | Apply database schema |
| `npm run db:seed` | Load country reference data |
| `npm run db:generate` | Generate new migrations after schema changes |

---

## App routes

| Route | Who can access | Purpose |
|-------|----------------|---------|
| `/` | Anyone | Marketing landing page |
| `/sign-in`, `/sign-up` | Anyone | Clerk sign-in |
| `/dashboard` | Signed-in users | Progress to 100 + stats |
| `/map` | Signed-in users | Interactive world map |
| `/countries` | Signed-in users | Searchable country list |
| `/favorites` | Signed-in users | Saved places by country |

---

## Security notes

- Never commit `.env` or `.env.local` — they contain secrets.
- `.env.example` is a template only; it has no real keys.
- Clerk handles password hashing, session tokens, and OAuth — you don’t manage that in this codebase.
- Postgres credentials in `POSTGRES_URL` grant full database access — treat them like a password.

---

## When you outgrow the free tiers

| Service | Free tier is usually enough until… |
|---------|-------------------------------------|
| Vercel | High traffic or many team members |
| Clerk | ~10,000+ monthly active users |
| Neon / Postgres | Large data volume or heavy queries |

You can upgrade each service independently without changing the app architecture.
