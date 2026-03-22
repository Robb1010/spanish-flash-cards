import { useEffect } from 'react';
import { useDeck } from './hooks/useDeck';
import { useSession } from './hooks/useSession';
import Flashcard from './components/Flashcard';
import SessionSummary from './components/SessionSummary';
import ProgressBar from './components/ProgressBar';
import StatusScreen from './components/StatusScreen';

export default function App() {
  const { deck, loading, error, reload } = useDeck();
  const { index, score, done, startSession, recordAnswer, advance, reset } =
    useSession(deck);

  useEffect(() => {
    if (deck.length > 0) {
      startSession();
    }
  }, [deck]);

  function handleCheck(quality) {
    recordAnswer(deck[index], quality);
  }

  function handleRestart() {
    reset();
    reload();
  }

  if (loading) {
    return <StatusScreen message="Loading cards..." />;
  }

  if (error) {
    return (
      <StatusScreen
        variant="error"
        message="Could not connect to database."
        detail="Check your .env.local Supabase credentials and reload."
      />
    );
  }

  if (deck.length === 0) {
    return (
      <StatusScreen
        variant="success"
        message={'\u2713 No cards due!'}
        detail="Come back later for your next review session."
      />
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Espa&ntilde;ol</h1>
        <p>Verb Conjugation Trainer &middot; A2</p>
      </div>

      <ProgressBar current={index} total={deck.length} />

      <div className="score-row">
        <span className="score-pill score-correct">{'\u2713'} {score.correct}</span>
        <span className="score-pill score-wrong">{'\u2717'} {score.wrong}</span>
      </div>

      {done ? (
        <SessionSummary score={score} total={deck.length} onRestart={handleRestart} />
      ) : (
        <Flashcard key={deck[index].id} card={deck[index]} onCheck={handleCheck} onNext={advance} isLast={index === deck.length - 1} />
      )}
    </div>
  );
}
