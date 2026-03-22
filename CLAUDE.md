# Spanish Flash Cards

Spanish verb conjugation trainer SPA with spaced repetition.

## Stack

- **Frontend**: React 19 + Vite 8, deployed to GitHub Pages
- **Database**: Supabase (Postgres) with Row Level Security
- **Auth**: Supabase anonymous sign-in (no login screen, JWT-based)
- **Algorithm**: SM-2 spaced repetition
- **Hosting**: GitHub Pages via `gh-pages` branch

## Project Structure

```
src/
├── lib/
│   ├── supabase.js      # Supabase client (reads from VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY)
│   ├── userId.js         # ensureUser() — Supabase anonymous auth, caches user ID
│   ├── sm2.js            # SM-2 algorithm + qualityMap (correct=5, hint=3, wrong=1)
│   ├── normalize.js      # Accent-insensitive string normalization for answer checking
│   └── shuffle.js        # Fisher-Yates shuffle
├── hooks/
│   ├── useDeck.js        # Loads due cards from Supabase, shuffles, limits to 20/session
│   └── useSession.js     # Session lifecycle: start, recordAnswer (SM-2 + upsert), advance, finish
├── components/
│   ├── Flashcard.jsx     # Card UI: input, check, hint, feedback, animations
│   ├── ProgressBar.jsx   # Progress bar + label
│   ├── SessionSummary.jsx # End-of-session stats + restart (Enter key supported)
│   └── StatusScreen.jsx  # Shared loading/error/empty state screen
├── App.jsx               # Root: wires hooks to components
├── index.css             # All styles — CSS custom properties, rem units
└── main.jsx              # Entry point
```

## Database Schema

3 tables in Supabase (defined in `supabase-setup.sql`):

- **cards** — master deck (verb, pronoun, tense, level, answer, hint). Unique on (verb, pronoun, tense). Read-only via RLS.
- **card_progress** — per-user SM-2 state (ease_factor, interval_days, repetitions, due_at). Uses `auth.uid()` for RLS.
- **sessions** — session history (cards_seen, cards_correct, cards_wrong). Uses `auth.uid()` for RLS.

All seed data is in `cards.json` (500 cards, 50 verbs, A2 level). CEFR levels supported: A1-C2.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run deploy` — build + deploy to gh-pages
- `npm run seed` — upsert cards.json to Supabase (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)

## Environment Variables (.env.local, gitignored)

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # only needed for npm run seed
```

## CSS Architecture

All styles in `src/index.css` using CSS custom properties (`:root` block). Units are `rem` throughout (16px base). Colors, gradients, shadows, radii, and fonts are all tokenized as `var(--...)`. Tense badge colors use `data-tense` attribute selectors.

## Key Design Decisions

- Anonymous auth over localStorage UUID — provides real JWT for RLS security
- SM-2 quality mapping: correct first try = 5, correct after hint = 3, wrong = 1
- Session limit of 20 cards — shuffle all due cards first, then slice
- Score updates on Check (not Next) for immediate feedback
- Enter key works throughout: check answer → advance → restart
- `prefers-reduced-motion` disables card animations
