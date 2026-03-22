import { useState, useEffect } from 'react';
import { useDeck } from './hooks/useDeck';
import { useSession } from './hooks/useSession';
import { saveSession, clearSession } from './lib/sessionStore';
import { getPrefs, setPrefs } from './lib/prefs';
import Flashcard from './components/Flashcard';
import SessionSummary from './components/SessionSummary';
import ProgressBar from './components/ProgressBar';
import StatusScreen from './components/StatusScreen';
import OptionsPanel from './components/OptionsPanel';

export default function App() {
  const [deckSize, setDeckSize] = useState(() => getPrefs().deckSize);
  const [showOptions, setShowOptions] = useState(false);
  const { deck, loading, error, reload } = useDeck(deckSize);
  const { index, score, done, startSession, recordAnswer, advance, reset } =
    useSession(deck);

  useEffect(() => {
    if (deck.length > 0) {
      startSession();
    }
  }, [deck]);

  // Persist in-progress session to localStorage
  useEffect(() => {
    if (deck.length > 0 && !done && !loading) {
      saveSession(deck, index, score);
    }
  }, [deck, index, score, done, loading]);

  // Clear saved session when done
  useEffect(() => {
    if (done) clearSession();
  }, [done]);

  function handleCheck(quality) {
    recordAnswer(deck[index], quality);
  }

  function handleSizeChange(size) {
    setPrefs({ deckSize: size });
    setDeckSize(size);
    clearSession();
    reset();
    // useDeck reloads automatically via deckSize dependency
  }

  function handleRestart() {
    clearSession();
    reset();
    reload();
  }

  function renderCard() {
    if (loading) return <StatusScreen message="Loading cards..." />;
    if (error) return (
      <StatusScreen
        variant="error"
        message="Could not connect to database."
        detail="Check your .env.local Supabase credentials and reload."
      />
    );
    if (deck.length === 0) return (
      <StatusScreen
        variant="success"
        message={'\u2713 No cards due!'}
        detail="Come back later for your next review session."
      />
    );
    if (done) return <SessionSummary score={score} total={deck.length} onRestart={handleRestart} />;
    return <Flashcard key={deck[index].id} card={deck[index]} onCheck={handleCheck} onNext={advance} isLast={index === deck.length - 1} />;
  }

  return (
    <div className="container">
      <div className="header-row">
        <div className="header">
          <h1>Espa&ntilde;ol</h1>
          <p>Verb Conjugation Trainer &middot; A2</p>
        </div>
        <div className="options-wrap">
          <button
            className={`btn-options${showOptions ? ' active' : ''}`}
            onClick={() => setShowOptions((v) => !v)}
            aria-label="Options"
          >
            &#9881;
          </button>
          {showOptions && (
            <OptionsPanel
              deckSize={deckSize}
              onDeckSizeChange={handleSizeChange}
              onClose={() => setShowOptions(false)}
            />
          )}
        </div>
      </div>

      <ProgressBar current={index} total={deck.length || deckSize} />

      <div className="score-row">
        <span className="score-pill score-correct">{'\u2713'} {score.correct}</span>
        <span className="score-pill score-wrong">{'\u2717'} {score.wrong}</span>
      </div>

      {renderCard()}
    </div>
  );
}
