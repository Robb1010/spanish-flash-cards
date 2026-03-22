import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ensureUser } from '../lib/userId';
import { sm2, qualityMap } from '../lib/sm2';
import { loadSession } from '../lib/sessionStore';

export function useSession(deck) {
  const _saved = loadSession();
  const [index, setIndex] = useState(_saved?.index ?? 0);
  const [score, setScore] = useState(_saved?.score ?? { correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const sessionId = useRef(null);

  async function startSession() {
    const userId = await ensureUser();
    const { data } = await supabase
      .from('sessions')
      .insert({ user_id: userId, cards_seen: 0, cards_correct: 0, cards_wrong: 0 })
      .select('id')
      .single();
    if (data) sessionId.current = data.id;
  }

  async function recordAnswer(card, quality) {
    const userId = await ensureUser();
    const qualityScore = typeof quality === 'string' ? qualityMap[quality] : quality;
    const isCorrect = qualityScore >= 3;

    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      wrong: score.wrong + (isCorrect ? 0 : 1),
    };
    setScore(newScore);

    const updated = sm2(qualityScore, card.progress);

    await supabase.from('card_progress').upsert(
      {
        user_id: userId,
        card_id: card.id,
        ease_factor: updated.ease_factor,
        interval_days: updated.interval_days,
        repetitions: updated.repetitions,
        due_at: updated.due_at,
        last_reviewed: new Date().toISOString(),
      },
      { onConflict: 'user_id,card_id' }
    );

    if (sessionId.current) {
      await supabase
        .from('sessions')
        .update({
          cards_seen: newScore.correct + newScore.wrong,
          cards_correct: newScore.correct,
          cards_wrong: newScore.wrong,
        })
        .eq('id', sessionId.current);
    }
  }

  function advance() {
    if (index + 1 >= deck.length) {
      finishSession();
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  async function finishSession() {
    if (sessionId.current) {
      await supabase
        .from('sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId.current);
    }
  }

  function reset() {
    setIndex(0);
    setScore({ correct: 0, wrong: 0 });
    setDone(false);
    sessionId.current = null;
  }

  return { index, score, done, startSession, recordAnswer, advance, reset };
}
