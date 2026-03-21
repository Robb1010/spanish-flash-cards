# Spanish Flashcard App — Implementation Plan
> Stack: React (Vite) · GitHub Pages · Supabase (free Postgres)  
> Features: Spaced repetition · Session history · Full card deck in DB

---

## Overview

A static React SPA hosted on GitHub Pages. All persistence (cards, user progress, session history) lives in Supabase. No backend server needed — the browser talks directly to Supabase via their JS client using Row Level Security (RLS).

Since this is personal use only, we'll use a simple **anonymous auth** approach: Supabase generates a persistent UUID for the browser on first visit, stored in localStorage. No login screen needed.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev, easy GitHub Pages deploy |
| Hosting | GitHub Pages | Free, git-native |
| Database | Supabase (free tier) | Free Postgres, JS client, RLS |
| Auth | Supabase anon key + localStorage UUID | Personal use, zero friction |
| Spaced repetition | SM-2 algorithm | Classic, battle-tested |
| Deploy | `gh-pages` npm package | One-command deploy |

---

## Project Structure

```
spanish-flashcards/
├── public/
├── src/
│   ├── lib/
│   │   ├── supabase.js          # Supabase client init
│   │   ├── sm2.js               # Spaced repetition algorithm
│   │   └── userId.js            # Anon user ID from localStorage
│   ├── components/
│   │   ├── Flashcard.jsx        # The card UI (from existing artifact)
│   │   ├── SessionSummary.jsx   # End-of-session score screen
│   │   └── ProgressBar.jsx      # Deck progress indicator
│   ├── hooks/
│   │   ├── useDeck.js           # Loads due cards from Supabase
│   │   └── useSession.js        # Tracks current session state
│   ├── App.jsx
│   └── main.jsx
├── .env.local                   # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── vite.config.js
└── package.json
```

---

## Database Schema (Supabase / Postgres)

Run this SQL in the Supabase SQL editor.

```sql
-- Cards master table (seed once, never changes during play)
create table cards (
  id          uuid primary key default gen_random_uuid(),
  verb        text not null,
  pronoun     text not null,
  tense       text not null check (tense in ('present', 'preterite')),
  answer      text not null,
  hint        text,
  created_at  timestamptz default now()
);

-- Per-user spaced repetition state (one row per user+card pair)
create table card_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null,           -- anon UUID from localStorage
  card_id         uuid references cards(id) on delete cascade,
  ease_factor     float default 2.5,       -- SM-2: starts at 2.5
  interval_days   int default 0,           -- days until next review
  repetitions     int default 0,           -- consecutive correct answers
  due_at          timestamptz default now(),
  last_reviewed   timestamptz,
  unique (user_id, card_id)
);

-- Session history (one row per completed session)
create table sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,
  started_at    timestamptz default now(),
  ended_at      timestamptz,
  cards_seen    int default 0,
  cards_correct int default 0,
  cards_wrong   int default 0
);

-- Enable Row Level Security
alter table card_progress enable row level security;
alter table sessions enable row level security;
alter table cards enable row level security;

-- RLS policies: users can only touch their own rows
create policy "own progress" on card_progress
  using (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
         or true);  -- simplified for anon key usage

create policy "own sessions" on sessions
  using (true);

create policy "read cards" on cards
  for select using (true);
```

> **Note on RLS:** For personal use with an anon key, using `true` policies is fine since only you will have the Supabase URL + anon key. If you ever want stricter isolation, swap to Supabase Auth with email login and proper JWT-based policies.

---

## Seed Data (cards table)

After creating the schema, seed the cards table. Create a `seed.sql` file:

```sql
insert into cards (verb, pronoun, tense, answer, hint) values
-- HABLAR present
('hablar','yo','present','hablo','to speak'),
('hablar','tú','present','hablas','to speak'),
('hablar','él/ella','present','habla','to speak'),
('hablar','nosotros','present','hablamos','to speak'),
('hablar','ellos','present','hablan','to speak'),
-- HABLAR preterite
('hablar','yo','preterite','hablé','to speak'),
('hablar','tú','preterite','hablaste','to speak'),
('hablar','él/ella','preterite','habló','to speak'),
('hablar','nosotros','preterite','hablamos','to speak'),
('hablar','ellos','preterite','hablaron','to speak'),
-- COMER present
('comer','yo','present','como','to eat'),
('comer','tú','present','comes','to eat'),
('comer','él/ella','present','come','to eat'),
('comer','nosotros','present','comemos','to eat'),
('comer','ellos','present','comen','to eat'),
-- COMER preterite
('comer','yo','preterite','comí','to eat'),
('comer','tú','preterite','comiste','to eat'),
('comer','él/ella','preterite','comió','to eat'),
('comer','nosotros','preterite','comimos','to eat'),
('comer','ellos','preterite','comieron','to eat'),
-- SER present
('ser','yo','present','soy','to be (permanent)'),
('ser','tú','present','eres','to be (permanent)'),
('ser','él/ella','present','es','to be (permanent)'),
('ser','nosotros','present','somos','to be (permanent)'),
('ser','ellos','present','son','to be (permanent)'),
-- SER preterite
('ser','yo','preterite','fui','to be (permanent)'),
('ser','tú','preterite','fuiste','to be (permanent)'),
('ser','él/ella','preterite','fue','to be (permanent)'),
('ser','nosotros','preterite','fuimos','to be (permanent)'),
('ser','ellos','preterite','fueron','to be (permanent)'),
-- ESTAR present
('estar','yo','present','estoy','to be (temporary)'),
('estar','tú','present','estás','to be (temporary)'),
('estar','él/ella','present','está','to be (temporary)'),
('estar','nosotros','present','estamos','to be (temporary)'),
('estar','ellos','present','están','to be (temporary)'),
-- TENER present
('tener','yo','present','tengo','to have'),
('tener','tú','present','tienes','to have'),
('tener','él/ella','present','tiene','to have'),
('tener','nosotros','present','tenemos','to have'),
('tener','ellos','present','tienen','to have'),
-- IR present
('ir','yo','present','voy','to go'),
('ir','tú','present','vas','to go'),
('ir','él/ella','present','va','to go'),
('ir','nosotros','present','vamos','to go'),
('ir','ellos','present','van','to go'),
-- IR preterite
('ir','yo','preterite','fui','to go'),
('ir','tú','preterite','fuiste','to go'),
('ir','él/ella','preterite','fue','to go'),
('ir','nosotros','preterite','fuimos','to go'),
('ir','ellos','preterite','fueron','to go'),
-- QUERER present
('querer','yo','present','quiero','to want'),
('querer','tú','present','quieres','to want'),
('querer','él/ella','present','quiere','to want'),
('querer','nosotros','present','queremos','to want'),
('querer','ellos','present','quieren','to want'),
-- VIVIR present
('vivir','yo','present','vivo','to live'),
('vivir','tú','present','vives','to live'),
('vivir','él/ella','present','vive','to live'),
('vivir','nosotros','present','vivimos','to live'),
('vivir','ellos','present','viven','to live');
```

---

## SM-2 Spaced Repetition Algorithm (`src/lib/sm2.js`)

```js
/**
 * SM-2 algorithm
 * @param {number} quality - 0 (blackout) to 5 (perfect)
 * @param {object} card - { ease_factor, interval_days, repetitions }
 * @returns updated { ease_factor, interval_days, repetitions, due_at }
 */
export function sm2(quality, { ease_factor, interval_days, repetitions }) {
  let newEF = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval, newReps;
  if (quality < 3) {
    // Incorrect: reset
    newReps = 0;
    newInterval = 1;
  } else {
    newReps = repetitions + 1;
    if (repetitions === 0)      newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else                        newInterval = Math.round(interval_days * newEF);
  }

  const due = new Date();
  due.setDate(due.getDate() + newInterval);

  return {
    ease_factor: newEF,
    interval_days: newInterval,
    repetitions: newReps,
    due_at: due.toISOString(),
  };
}

// Map user response to SM-2 quality score
// "correct" on first try → 5, after hint → 3, wrong → 1
export const qualityMap = { correct: 5, hint: 3, wrong: 1 };
```

---

## Key Implementation Notes for Claude Code

### 1. Supabase client (`src/lib/supabase.js`)
```js
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 2. Anon user ID (`src/lib/userId.js`)
```js
import { v4 as uuidv4 } from 'uuid';
export function getUserId() {
  let id = localStorage.getItem('anon_user_id');
  if (!id) { id = uuidv4(); localStorage.setItem('anon_user_id', id); }
  return id;
}
```

### 3. Loading due cards (`src/hooks/useDeck.js`)
- Query `card_progress` for cards where `due_at <= now()` for this user
- For cards with **no progress row yet**, also include them (they're new)
- Pattern: fetch all `card_progress` for user, fetch all `cards`, compute which are new or due
- Limit to ~20 cards per session to avoid overwhelm

### 4. Saving progress after each answer
After each card answer:
1. Call `sm2(quality, currentProgress)` to get new values
2. `upsert` into `card_progress` (insert or update on `user_id + card_id` conflict)
3. Update session running totals in local state (flush to `sessions` table on completion)

### 5. Session save on completion
When the deck is exhausted or user clicks "Finish":
- Insert/update `sessions` row with `ended_at`, `cards_seen`, `cards_correct`, `cards_wrong`

---

## Vite Config for GitHub Pages (`vite.config.js`)

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/spanish-flashcards/',  // must match your GitHub repo name
});
```

---

## package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2",
    "react": "^18",
    "react-dom": "^18",
    "uuid": "^9"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4",
    "gh-pages": "^6",
    "vite": "^5"
  }
}
```

---

## Setup Checklist (do this first)

### Supabase
- [ ] Create free account at supabase.com
- [ ] New project → note the **Project URL** and **anon public key** (Settings → API)
- [ ] Run `schema.sql` in SQL Editor
- [ ] Run `seed.sql` in SQL Editor
- [ ] Confirm cards appear in Table Editor

### GitHub
- [ ] Create new repo: `spanish-flashcards`
- [ ] In repo Settings → Pages → Source: `gh-pages` branch

### Local
- [ ] `npm create vite@latest spanish-flashcards -- --template react`
- [ ] Copy `src/` structure above
- [ ] Create `.env.local`:
  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] `.gitignore` must include `.env.local` (never commit keys)
- [ ] `npm run dev` to verify locally
- [ ] `npm run deploy` to push to GitHub Pages

---

## Environment Variables in GitHub Actions (optional CI deploy)

If you want auto-deploy on push instead of manual `npm run deploy`:

1. Repo Settings → Secrets → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## UI Components to Port from Existing Artifact

The existing `spanish-flashcards.jsx` artifact has the full card UI. Port it with these changes:

- Remove the hardcoded `cards` array — load from Supabase instead
- Remove local `score` state — persist to `sessions` table
- Add a loading state for the initial Supabase fetch
- Add a "cards due today" vs "all cards" toggle
- Keep the existing visual design (dark warm theme, Playfair Display font)

---

## Free Tier Limits (you won't hit these)

| Resource | Supabase Free Limit | Expected Usage |
|---|---|---|
| DB size | 500 MB | ~1 MB |
| API requests | 2M / month | ~1K / month |
| GitHub Pages bandwidth | 100 GB / month | ~10 MB / month |
