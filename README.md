# Spanish Flash Cards

A Spanish verb conjugation trainer with spaced repetition. Practice present and preterite tenses across 500 cards (50 A2-level verbs × 2 tenses × 5 pronouns). Progress is tracked per-user via Supabase — no account required.

**Live app:** https://robb1010.github.io/spanish-flash-cards/

---

## How it works

Each session shows up to 20 cards that are due for review, shuffled randomly. Type the conjugation, press Enter (or click Check). The app gives immediate feedback and updates your score. After checking, press Enter again to advance.

- **Correct first try** — card scheduled further out (SM-2 quality 5)
- **Correct after hint** — card scheduled moderately (SM-2 quality 3)
- **Wrong** — card comes back soon (SM-2 quality 1)

The hint button reveals the English meaning. Typing with or without accents both accepted (á = a).

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase anonymous sign-in (no login screen) |
| Algorithm | SM-2 spaced repetition |
| Hosting | GitHub Pages (`gh-pages` branch) |

---

## Project structure

```
src/
├── lib/
│   ├── supabase.js       # Supabase client (reads VITE_* env vars)
│   ├── userId.js         # ensureUser() — anonymous auth, caches user ID
│   ├── sm2.js            # SM-2 algorithm + quality map
│   ├── normalize.js      # Accent-insensitive string normalization
│   └── shuffle.js        # Fisher-Yates shuffle
├── hooks/
│   ├── useDeck.js        # Loads due cards, shuffles, limits to 20/session
│   └── useSession.js     # Session lifecycle + SM-2 state persistence
├── components/
│   ├── Flashcard.jsx     # Card UI: input, check, hint, feedback, animations
│   ├── ProgressBar.jsx   # Progress bar + counter
│   ├── SessionSummary.jsx # End-of-session stats + restart
│   └── StatusScreen.jsx  # Loading / error / empty state screens
├── App.jsx               # Root component — wires hooks to components
├── index.css             # All styles (CSS custom properties, rem units)
└── main.jsx              # Entry point

scripts/
└── seed.js               # Upserts cards.json to Supabase (requires service role key)

cards.json                # Source of truth for the card deck (500 cards)
supabase-setup.sql        # Schema, RLS policies, and seed data
```

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/robb1010/spanish-flash-cards.git
cd spanish-flash-cards
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then run `supabase-setup.sql` in the SQL Editor. This creates the schema, enables RLS, and inserts the initial seed data.

### 3. Configure environment variables

Create `.env.local` (gitignored):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # only needed for npm run seed
```

The anon key is safe to expose in the browser — RLS ensures each user only sees their own data.

### 4. Run the dev server

```bash
npm run dev
```

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build + push to `gh-pages` branch |
| `npm run seed` | Upsert `cards.json` to Supabase |

---

## Database schema

### `cards` — master deck (read-only via RLS)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `verb` | text | e.g. `hablar` |
| `pronoun` | text | e.g. `yo`, `tú`, `él/ella`, `nosotros`, `ellos` |
| `tense` | text | `present` or `preterite` |
| `level` | text | CEFR level: A1–C2 |
| `answer` | text | Correct conjugation |
| `hint` | text | English meaning |

Unique constraint on `(verb, pronoun, tense)`.

### `card_progress` — per-user SM-2 state

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | `auth.uid()` — set automatically |
| `card_id` | uuid | FK to `cards` |
| `ease_factor` | float | SM-2 ease factor (starts at 2.5) |
| `interval_days` | int | Days until next review |
| `repetitions` | int | Consecutive correct answers |
| `due_at` | timestamptz | Next review date |

### `sessions` — session history

Tracks `cards_seen`, `cards_correct`, `cards_wrong`, `started_at`, `ended_at` per user per session.

---

## Adding or updating cards

Edit `cards.json`, then run:

```bash
npm run seed
```

The seed script upserts by `(verb, pronoun, tense)` — safe to re-run. Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` to bypass RLS.

---

## Deployment

The app deploys to GitHub Pages from the `gh-pages` branch:

```bash
npm run deploy
```

Make sure the repository is **public** and GitHub Pages is configured to serve from the `gh-pages` branch (repo Settings → Pages).

---

## Security

- Anonymous auth via Supabase `signInAnonymously()` — each visitor gets a real JWT without creating an account
- Row Level Security enforces `auth.uid() = user_id` on all progress and session data
- The `cards` table is read-only for all authenticated users
- The service role key (for seeding) is never exposed to the browser
