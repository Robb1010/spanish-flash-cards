import { useState } from 'react';

const TENSE_COLOR = {
  present: { badge: '#2980b9', label: 'Presente' },
  preterite: { badge: '#c0392b', label: 'Pret\u00e9rito' },
};

export default function Flashcard({ card, onAnswer }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null); // null | "correct" | "hint" | "wrong"
  const [revealed, setRevealed] = useState(false);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const tenseInfo = TENSE_COLOR[card.tense] || TENSE_COLOR.present;

  function normalize(s) {
    return s
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, '');
  }

  function checkAnswer() {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(card.answer);
    if (correct) {
      setStatus(hintUsed ? 'hint' : 'correct');
      setPop(true);
      setTimeout(() => setPop(false), 600);
    } else {
      setStatus('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setRevealed(true);
  }

  function handleNext() {
    onAnswer(status || 'wrong');
  }

  function showHint() {
    setHintUsed(true);
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      if (!revealed) checkAnswer();
      else handleNext();
    }
  }

  return (
    <div className={`card ${shake ? 'shake' : ''} ${pop ? 'pop' : ''}`}>
      <span className="tense-badge" style={{ background: tenseInfo.badge }}>
        {tenseInfo.label}
      </span>

      <div className="hint">{card.hint}</div>
      <div className="verb-display">{card.verb}</div>
      <div className="pronoun">{card.pronoun}</div>

      {hintUsed && !revealed && (
        <div className="hint-reveal">
          First letter: <strong>{card.answer[0]}</strong>... ({card.answer.length} letters)
        </div>
      )}

      <div className="divider" />

      <div className="input-area">
        <input
          type="text"
          placeholder="conjugation\u2026"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className={
            status === 'correct' || status === 'hint' ? 'correct' : status === 'wrong' ? 'wrong' : ''
          }
          disabled={revealed}
          autoFocus
        />
        {!revealed && !hintUsed && (
          <button className="btn-hint" onClick={showHint} type="button">
            Hint
          </button>
        )}
        <button
          className="btn-check"
          onClick={checkAnswer}
          disabled={revealed || !input.trim()}
        >
          Check
        </button>
      </div>

      {revealed && (
        <div className={`feedback ${status === 'wrong' ? 'wrong' : 'correct'}`}>
          {status === 'wrong'
            ? `\u2717 The answer is "${card.answer}"`
            : `\u2713 \u00A1Correcto! "${card.answer}"`}
        </div>
      )}

      {revealed && (
        <button className="btn-next" onClick={handleNext}>
          Next card {'\u2192'}
        </button>
      )}
    </div>
  );
}
