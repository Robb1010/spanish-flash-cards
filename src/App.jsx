import { useEffect } from 'react';
import { useDeck } from './hooks/useDeck';
import { useSession } from './hooks/useSession';
import Flashcard from './components/Flashcard';
import SessionSummary from './components/SessionSummary';
import ProgressBar from './components/ProgressBar';

export default function App() {
  const { deck, loading, error, reload } = useDeck();
  const { index, score, done, startSession, recordAnswer, advance, reset } =
    useSession(deck);

  useEffect(() => {
    if (deck.length > 0) {
      startSession();
    }
  }, [deck]);

  function handleAnswer(quality) {
    const card = deck[index];
    recordAnswer(card, quality);
    advance();
  }

  function handleRestart() {
    reset();
    reload();
  }

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Espa&ntilde;ol</h1>
          <p>Verb Conjugation Trainer</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
          <p style={{ color: '#7a6040', fontSize: '1.1rem' }}>Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>Espa&ntilde;ol</h1>
          <p>Verb Conjugation Trainer</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <p style={{ color: '#922', fontSize: '0.95rem', marginBottom: 12 }}>
            Could not connect to database.
          </p>
          <p style={{ color: '#7a6040', fontSize: '0.82rem' }}>
            Check your <code>.env.local</code> Supabase credentials and reload.
          </p>
        </div>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="container">
        <div className="header">
          <h1>Espa&ntilde;ol</h1>
          <p>Verb Conjugation Trainer</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
          <p style={{ color: '#2a7a48', fontSize: '1.1rem', marginBottom: 8 }}>
            {'\u2713'} No cards due!
          </p>
          <p style={{ color: '#7a6040', fontSize: '0.88rem' }}>
            Come back later for your next review session.
          </p>
        </div>
      </div>
    );
  }

  const card = deck[index];

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
        <Flashcard key={card.id} card={card} onAnswer={handleAnswer} />
      )}

      <p style={{ color: '#5a4830', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
        PRESS ENTER TO CHECK &middot; ENTER AGAIN TO ADVANCE
      </p>
    </div>
  );
}
