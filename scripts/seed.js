import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing env vars. Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const cards = JSON.parse(readFileSync(new URL('../cards.json', import.meta.url), 'utf-8'));

console.log(`Seeding ${cards.length} cards...`);

const { data, error } = await supabase
  .from('cards')
  .upsert(cards, { onConflict: 'verb,pronoun,tense' })
  .select();

if (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

console.log(`Done. ${data.length} cards upserted.`);
