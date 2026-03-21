-- ============================================================
-- Spanish Flashcards — Supabase Setup
-- Run this entire file in the Supabase SQL Editor (one shot).
-- ============================================================

-- 1. SCHEMA ------------------------------------------------

-- Cards master table (seed once, never changes during play)
create table cards (
  id          uuid primary key default gen_random_uuid(),
  verb        text not null,
  pronoun     text not null,
  tense       text not null check (tense in ('present', 'preterite')),
  level       text not null default 'A2' check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  answer      text not null,
  hint        text,
  created_at  timestamptz default now()
);

-- Per-user spaced repetition state (one row per user+card pair)
create table card_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null,
  card_id         uuid references cards(id) on delete cascade,
  ease_factor     float default 2.5,
  interval_days   int default 0,
  repetitions     int default 0,
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

-- 2. ROW LEVEL SECURITY ------------------------------------

alter table cards enable row level security;
alter table card_progress enable row level security;
alter table sessions enable row level security;

-- Everyone can read cards
create policy "read cards" on cards
  for select using (true);

-- Personal-use open policies (anon key only you have)
create policy "all card_progress" on card_progress
  for all using (true) with check (true);

create policy "all sessions" on sessions
  for all using (true) with check (true);

-- 3. SEED DATA ---------------------------------------------

insert into cards (verb, pronoun, tense, level, answer, hint) values
-- HABLAR present
('hablar','yo','present','A2','hablo','to speak'),
('hablar','tú','present','A2','hablas','to speak'),
('hablar','él/ella','present','A2','habla','to speak'),
('hablar','nosotros','present','A2','hablamos','to speak'),
('hablar','ellos','present','A2','hablan','to speak'),
-- HABLAR preterite
('hablar','yo','preterite','A2','hablé','to speak'),
('hablar','tú','preterite','A2','hablaste','to speak'),
('hablar','él/ella','preterite','A2','habló','to speak'),
('hablar','nosotros','preterite','A2','hablamos','to speak'),
('hablar','ellos','preterite','A2','hablaron','to speak'),
-- COMER present
('comer','yo','present','A2','como','to eat'),
('comer','tú','present','A2','comes','to eat'),
('comer','él/ella','present','A2','come','to eat'),
('comer','nosotros','present','A2','comemos','to eat'),
('comer','ellos','present','A2','comen','to eat'),
-- COMER preterite
('comer','yo','preterite','A2','comí','to eat'),
('comer','tú','preterite','A2','comiste','to eat'),
('comer','él/ella','preterite','A2','comió','to eat'),
('comer','nosotros','preterite','A2','comimos','to eat'),
('comer','ellos','preterite','A2','comieron','to eat'),
-- SER present
('ser','yo','present','A2','soy','to be (permanent)'),
('ser','tú','present','A2','eres','to be (permanent)'),
('ser','él/ella','present','A2','es','to be (permanent)'),
('ser','nosotros','present','A2','somos','to be (permanent)'),
('ser','ellos','present','A2','son','to be (permanent)'),
-- SER preterite
('ser','yo','preterite','A2','fui','to be (permanent)'),
('ser','tú','preterite','A2','fuiste','to be (permanent)'),
('ser','él/ella','preterite','A2','fue','to be (permanent)'),
('ser','nosotros','preterite','A2','fuimos','to be (permanent)'),
('ser','ellos','preterite','A2','fueron','to be (permanent)'),
-- ESTAR present
('estar','yo','present','A2','estoy','to be (temporary)'),
('estar','tú','present','A2','estás','to be (temporary)'),
('estar','él/ella','present','A2','está','to be (temporary)'),
('estar','nosotros','present','A2','estamos','to be (temporary)'),
('estar','ellos','present','A2','están','to be (temporary)'),
-- TENER present
('tener','yo','present','A2','tengo','to have'),
('tener','tú','present','A2','tienes','to have'),
('tener','él/ella','present','A2','tiene','to have'),
('tener','nosotros','present','A2','tenemos','to have'),
('tener','ellos','present','A2','tienen','to have'),
-- IR present
('ir','yo','present','A2','voy','to go'),
('ir','tú','present','A2','vas','to go'),
('ir','él/ella','present','A2','va','to go'),
('ir','nosotros','present','A2','vamos','to go'),
('ir','ellos','present','A2','van','to go'),
-- IR preterite
('ir','yo','preterite','A2','fui','to go'),
('ir','tú','preterite','A2','fuiste','to go'),
('ir','él/ella','preterite','A2','fue','to go'),
('ir','nosotros','preterite','A2','fuimos','to go'),
('ir','ellos','preterite','A2','fueron','to go'),
-- QUERER present
('querer','yo','present','A2','quiero','to want'),
('querer','tú','present','A2','quieres','to want'),
('querer','él/ella','present','A2','quiere','to want'),
('querer','nosotros','present','A2','queremos','to want'),
('querer','ellos','present','A2','quieren','to want'),
-- VIVIR present
('vivir','yo','present','A2','vivo','to live'),
('vivir','tú','present','A2','vives','to live'),
('vivir','él/ella','present','A2','vive','to live'),
('vivir','nosotros','present','A2','vivimos','to live'),
('vivir','ellos','present','A2','viven','to live');
