import { useState, useRef } from 'react';
import { normalize } from '../lib/normalize';

const TENSE_LABEL = {
  present: 'Presente',
  preterite: 'Pret\u00e9rito',
};

export default function Flashcard({ card, onCheck, onNext, isLast }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const cardRef = useRef(null);

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
    onCheck(correct ? (hintUsed ? 'hint' : 'correct') : 'wrong');
    setTimeout(() => cardRef.current?.focus(), 0);
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      if (!revealed) checkAnswer();
      else onNext();
    }
  }

  return (
    <div ref={cardRef} className={`card ${shake ? 'shake' : ''} ${pop ? 'pop' : ''}`} tabIndex={-1} onKeyDown={handleKey}>
      <div className="hint">{card.hint}</div>
      <div className="verb-display">{card.verb}</div>
      <div className="pronoun-row">
        <div className="pronoun">{card.pronoun}</div>
        <span className="tense-badge" data-tense={card.tense}>
          {TENSE_LABEL[card.tense] || card.tense}
        </span>
      </div>

      {hintUsed && !revealed && (
        <div className="hint-reveal">
          First letter: <strong>{card.answer[0]}</strong>... ({card.answer.length} letters)
        </div>
      )}

      <div className="divider" />

      <div className="input-area">
        <input
          type="text"
          placeholder="conjugation…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className={
            status === 'correct' || status === 'hint' ? 'correct' : status === 'wrong' ? 'wrong' : ''
          }
          disabled={revealed}
          autoFocus
        />
        <div className="input-buttons">
          {!revealed && !hintUsed && (
            <button className="btn-hint" onClick={() => setHintUsed(true)} type="button">
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
      </div>

      {revealed && (
        <div className={`feedback ${status === 'wrong' ? 'wrong' : 'correct'}`}>
          {status === 'wrong'
            ? `\u2717 The answer is "${card.answer}"`
            : `\u2713 \u00A1Correcto! "${card.answer}"`}
        </div>
      )}

      {revealed && (
        <button className="btn-next" onClick={onNext}>
          {isLast ? 'Finish' : 'Next card \u2192'}
        </button>
      )}
    </div>
  );
}
