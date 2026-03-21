import { useState, useEffect } from "react";

const cards = [
  // HABLAR - present
  { verb: "hablar", pronoun: "yo", tense: "present", answer: "hablo", hint: "to speak" },
  { verb: "hablar", pronoun: "tú", tense: "present", answer: "hablas", hint: "to speak" },
  { verb: "hablar", pronoun: "él/ella", tense: "present", answer: "habla", hint: "to speak" },
  { verb: "hablar", pronoun: "nosotros", tense: "present", answer: "hablamos", hint: "to speak" },
  { verb: "hablar", pronoun: "ellos", tense: "present", answer: "hablan", hint: "to speak" },
  // HABLAR - preterite
  { verb: "hablar", pronoun: "yo", tense: "preterite", answer: "hablé", hint: "to speak" },
  { verb: "hablar", pronoun: "tú", tense: "preterite", answer: "hablaste", hint: "to speak" },
  { verb: "hablar", pronoun: "él/ella", tense: "preterite", answer: "habló", hint: "to speak" },
  { verb: "hablar", pronoun: "nosotros", tense: "preterite", answer: "hablamos", hint: "to speak" },
  { verb: "hablar", pronoun: "ellos", tense: "preterite", answer: "hablaron", hint: "to speak" },
  // COMER - present
  { verb: "comer", pronoun: "yo", tense: "present", answer: "como", hint: "to eat" },
  { verb: "comer", pronoun: "tú", tense: "present", answer: "comes", hint: "to eat" },
  { verb: "comer", pronoun: "él/ella", tense: "present", answer: "come", hint: "to eat" },
  { verb: "comer", pronoun: "nosotros", tense: "present", answer: "comemos", hint: "to eat" },
  { verb: "comer", pronoun: "ellos", tense: "present", answer: "comen", hint: "to eat" },
  // COMER - preterite
  { verb: "comer", pronoun: "yo", tense: "preterite", answer: "comí", hint: "to eat" },
  { verb: "comer", pronoun: "tú", tense: "preterite", answer: "comiste", hint: "to eat" },
  { verb: "comer", pronoun: "él/ella", tense: "preterite", answer: "comió", hint: "to eat" },
  { verb: "comer", pronoun: "nosotros", tense: "preterite", answer: "comimos", hint: "to eat" },
  { verb: "comer", pronoun: "ellos", tense: "preterite", answer: "comieron", hint: "to eat" },
  // SER - present
  { verb: "ser", pronoun: "yo", tense: "present", answer: "soy", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "tú", tense: "present", answer: "eres", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "él/ella", tense: "present", answer: "es", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "nosotros", tense: "present", answer: "somos", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "ellos", tense: "present", answer: "son", hint: "to be (permanent)" },
  // SER - preterite
  { verb: "ser", pronoun: "yo", tense: "preterite", answer: "fui", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "tú", tense: "preterite", answer: "fuiste", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "él/ella", tense: "preterite", answer: "fue", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "nosotros", tense: "preterite", answer: "fuimos", hint: "to be (permanent)" },
  { verb: "ser", pronoun: "ellos", tense: "preterite", answer: "fueron", hint: "to be (permanent)" },
  // ESTAR - present
  { verb: "estar", pronoun: "yo", tense: "present", answer: "estoy", hint: "to be (temporary)" },
  { verb: "estar", pronoun: "tú", tense: "present", answer: "estás", hint: "to be (temporary)" },
  { verb: "estar", pronoun: "él/ella", tense: "present", answer: "está", hint: "to be (temporary)" },
  { verb: "estar", pronoun: "nosotros", tense: "present", answer: "estamos", hint: "to be (temporary)" },
  { verb: "estar", pronoun: "ellos", tense: "present", answer: "están", hint: "to be (temporary)" },
  // TENER - present
  { verb: "tener", pronoun: "yo", tense: "present", answer: "tengo", hint: "to have" },
  { verb: "tener", pronoun: "tú", tense: "present", answer: "tienes", hint: "to have" },
  { verb: "tener", pronoun: "él/ella", tense: "present", answer: "tiene", hint: "to have" },
  { verb: "tener", pronoun: "nosotros", tense: "present", answer: "tenemos", hint: "to have" },
  { verb: "tener", pronoun: "ellos", tense: "present", answer: "tienen", hint: "to have" },
  // IR - present
  { verb: "ir", pronoun: "yo", tense: "present", answer: "voy", hint: "to go" },
  { verb: "ir", pronoun: "tú", tense: "present", answer: "vas", hint: "to go" },
  { verb: "ir", pronoun: "él/ella", tense: "present", answer: "va", hint: "to go" },
  { verb: "ir", pronoun: "nosotros", tense: "present", answer: "vamos", hint: "to go" },
  { verb: "ir", pronoun: "ellos", tense: "present", answer: "van", hint: "to go" },
  // IR - preterite
  { verb: "ir", pronoun: "yo", tense: "preterite", answer: "fui", hint: "to go" },
  { verb: "ir", pronoun: "tú", tense: "preterite", answer: "fuiste", hint: "to go" },
  { verb: "ir", pronoun: "él/ella", tense: "preterite", answer: "fue", hint: "to go" },
  { verb: "ir", pronoun: "nosotros", tense: "preterite", answer: "fuimos", hint: "to go" },
  { verb: "ir", pronoun: "ellos", tense: "preterite", answer: "fueron", hint: "to go" },
  // QUERER - present
  { verb: "querer", pronoun: "yo", tense: "present", answer: "quiero", hint: "to want" },
  { verb: "querer", pronoun: "tú", tense: "present", answer: "quieres", hint: "to want" },
  { verb: "querer", pronoun: "él/ella", tense: "present", answer: "quiere", hint: "to want" },
  { verb: "querer", pronoun: "nosotros", tense: "present", answer: "queremos", hint: "to want" },
  // VIVIR - present
  { verb: "vivir", pronoun: "yo", tense: "present", answer: "vivo", hint: "to live" },
  { verb: "vivir", pronoun: "tú", tense: "present", answer: "vives", hint: "to live" },
  { verb: "vivir", pronoun: "él/ella", tense: "present", answer: "vive", hint: "to live" },
  { verb: "vivir", pronoun: "nosotros", tense: "present", answer: "vivimos", hint: "to live" },
  { verb: "vivir", pronoun: "ellos", tense: "present", answer: "viven", hint: "to live" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TENSE_COLOR = {
  present: { bg: "#e8f4fd", badge: "#2980b9", label: "Presente" },
  preterite: { bg: "#fdf0e8", badge: "#c0392b", label: "Pretérito" },
};

export default function App() {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null); // null | "correct" | "wrong"
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);

  const card = deck[index];

  function normalize(s) {
    return s.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
  }

  function checkAnswer() {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(card.answer);
    if (correct) {
      setStatus("correct");
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      setPop(true);
      setTimeout(() => setPop(false), 600);
    } else {
      setStatus("wrong");
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setRevealed(true);
  }

  function nextCard() {
    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setInput("");
      setStatus(null);
      setRevealed(false);
    }
  }

  function restart() {
    setDeck(shuffle(cards));
    setIndex(0);
    setInput("");
    setStatus(null);
    setRevealed(false);
    setScore({ correct: 0, wrong: 0 });
    setDone(false);
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      if (!revealed) checkAnswer();
      else nextCard();
    }
  }

  const tenseInfo = card ? TENSE_COLOR[card.tense] : TENSE_COLOR.present;
  const progress = Math.round((index / deck.length) * 100);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #1a1008;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      width: 100%;
      max-width: 480px;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .header {
      text-align: center;
      color: #e8c97a;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      letter-spacing: 0.04em;
      color: #f0d98a;
    }
    .header p {
      font-size: 0.78rem;
      color: #9c8860;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .progress-bar-wrap {
      width: 100%;
      background: #2e1f0a;
      border-radius: 99px;
      height: 6px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #e8a020, #f0d060);
      border-radius: 99px;
      transition: width 0.4s ease;
    }
    .progress-label {
      font-size: 0.72rem;
      color: #7a6840;
      text-align: right;
      width: 100%;
      margin-top: -10px;
    }

    .score-row {
      display: flex;
      gap: 16px;
    }
    .score-pill {
      padding: 4px 14px;
      border-radius: 99px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .score-correct { background: #1a3020; color: #5ecf8a; border: 1px solid #2a4a32; }
    .score-wrong   { background: #300a0a; color: #e06060; border: 1px solid #4a1a1a; }

    .card {
      width: 100%;
      background: #fdf6e8;
      border-radius: 20px;
      padding: 36px 32px 28px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
      position: relative;
      transition: transform 0.15s ease;
    }
    .card.shake {
      animation: shake 0.4s ease;
    }
    .card.pop {
      animation: pop 0.4s ease;
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    @keyframes pop {
      0% { transform: scale(1); }
      40% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }

    .tense-badge {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 99px;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: white;
      margin-bottom: 20px;
    }

    .hint {
      font-size: 0.78rem;
      color: #a08860;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .verb-display {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      color: #2a1a08;
      line-height: 1.1;
    }

    .pronoun {
      display: inline-block;
      background: #f0e0b8;
      color: #7a4e10;
      padding: 4px 14px;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      margin-top: 10px;
    }

    .divider {
      height: 1px;
      background: #e0d0a8;
      margin: 22px 0 18px;
    }

    .input-area {
      display: flex;
      gap: 10px;
      align-items: stretch;
    }
    .input-area input {
      flex: 1;
      padding: 12px 16px;
      border-radius: 12px;
      border: 2px solid #d4c090;
      background: #fffdf4;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.05rem;
      color: #2a1a08;
      outline: none;
      transition: border-color 0.2s;
    }
    .input-area input:focus { border-color: #c0902a; }
    .input-area input.correct { border-color: #3aaa60; background: #f0fff5; }
    .input-area input.wrong   { border-color: #dd4444; background: #fff5f5; }
    .input-area input:disabled { opacity: 0.7; }

    .btn-check {
      padding: 12px 20px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #d08020, #e8a030);
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      white-space: nowrap;
    }
    .btn-check:active { transform: scale(0.97); }
    .btn-check:disabled { opacity: 0.4; cursor: default; }

    .feedback {
      margin-top: 14px;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 500;
    }
    .feedback.correct {
      background: #e8fff0;
      color: #2a7a48;
      border: 1px solid #b0e8c8;
    }
    .feedback.wrong {
      background: #fff0f0;
      color: #922;
      border: 1px solid #f0b0b0;
    }

    .btn-next {
      width: 100%;
      margin-top: 12px;
      padding: 13px;
      border-radius: 12px;
      border: 2px solid #c0902a;
      background: transparent;
      color: #c0902a;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: background 0.2s, color 0.2s;
    }
    .btn-next:hover { background: #c0902a; color: white; }

    /* Done screen */
    .done-card {
      width: 100%;
      background: #fdf6e8;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
    }
    .done-card .trophy { font-size: 3rem; margin-bottom: 12px; }
    .done-card h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      color: #2a1a08;
      margin-bottom: 8px;
    }
    .done-card p { color: #7a6040; font-size: 0.95rem; margin-bottom: 24px; }
    .done-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 28px;
    }
    .done-stat {
      padding: 12px 24px;
      border-radius: 14px;
      font-size: 1.2rem;
      font-weight: 700;
    }
    .btn-restart {
      padding: 14px 32px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #d08020, #e8a030);
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-restart:hover { opacity: 0.85; }
  `;

  if (done) {
    const pct = Math.round((score.correct / deck.length) * 100);
    return (
      <>
        <style>{styles}</style>
        <div className="container">
          <div className="header">
            <h1>Español</h1>
            <p>Verb Conjugation Trainer</p>
          </div>
          <div className="done-card">
            <div className="trophy">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}</div>
            <h2>{pct >= 80 ? "¡Excelente!" : pct >= 50 ? "¡Bien hecho!" : "¡Sigue practicando!"}</h2>
            <p>You completed all {deck.length} cards</p>
            <div className="done-stats">
              <div className="done-stat score-correct">✓ {score.correct}</div>
              <div className="done-stat score-wrong">✗ {score.wrong}</div>
            </div>
            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#c0902a", marginBottom: 20 }}>{pct}% correct</p>
            <button className="btn-restart" onClick={restart}>Shuffle & Restart</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <h1>Español</h1>
          <p>Verb Conjugation Trainer · A2</p>
        </div>

        <div style={{ width: "100%" }}>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">{index + 1} / {deck.length}</div>
        </div>

        <div className="score-row">
          <span className="score-pill score-correct">✓ {score.correct}</span>
          <span className="score-pill score-wrong">✗ {score.wrong}</span>
        </div>

        <div className={`card ${shake ? "shake" : ""} ${pop ? "pop" : ""}`} onKeyDown={handleKey}>
          <span
            className="tense-badge"
            style={{ background: tenseInfo.badge }}
          >
            {tenseInfo.label}
          </span>

          <div className="hint">{card.hint}</div>
          <div className="verb-display">{card.verb}</div>
          <div className="pronoun">{card.pronoun}</div>

          <div className="divider" />

          <div className="input-area">
            <input
              type="text"
              placeholder="conjugation…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              className={status === "correct" ? "correct" : status === "wrong" ? "wrong" : ""}
              disabled={revealed}
              autoFocus
            />
            <button
              className="btn-check"
              onClick={checkAnswer}
              disabled={revealed || !input.trim()}
            >
              Check
            </button>
          </div>

          {revealed && (
            <div className={`feedback ${status}`}>
              {status === "correct"
                ? `✓ ¡Correcto! "${card.answer}"`
                : `✗ The answer is "${card.answer}"`
              }
            </div>
          )}

          {revealed && (
            <button className="btn-next" onClick={nextCard}>
              Next card →
            </button>
          )}
        </div>

        <p style={{ color: "#5a4830", fontSize: "0.72rem", letterSpacing: "0.06em" }}>
          PRESS ENTER TO CHECK · ENTER AGAIN TO ADVANCE
        </p>
      </div>
    </>
  );
}
