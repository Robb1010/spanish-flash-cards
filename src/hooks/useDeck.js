import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ensureUser } from '../lib/userId';
import { shuffle } from '../lib/shuffle';
import { loadSession } from '../lib/sessionStore';

export function useDeck(deckSize) {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadDeck(fresh = false) {
    if (!fresh) {
      const saved = loadSession();
      if (saved?.deck?.length) {
        setDeck(saved.deck);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    setError(null);
    const userId = await ensureUser();

    try {
      const [{ data: cards, error: cardsErr }, { data: progress, error: progErr }] =
        await Promise.all([
          supabase.from('cards').select('*'),
          supabase.from('card_progress').select('*').eq('user_id', userId),
        ]);

      if (cardsErr) throw cardsErr;
      if (progErr) throw progErr;

      const progressMap = new Map(progress.map((p) => [p.card_id, p]));

      const now = new Date();

      const dueCards = cards
        .map((card) => {
          const prog = progressMap.get(card.id);
          return {
            ...card,
            progress: prog || {
              ease_factor: 2.5,
              interval_days: 0,
              repetitions: 0,
              due_at: now.toISOString(),
            },
          };
        })
        .filter((card) => new Date(card.progress.due_at) <= now);

      setDeck(shuffle(dueCards).slice(0, deckSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeck();
  }, [deckSize]);

  return { deck, loading, error, reload: () => loadDeck(true) };
}
