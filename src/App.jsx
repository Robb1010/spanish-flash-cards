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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.49.49 0 0 0 13.92 2.4H10.08c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94L2.86 14.52c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
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
