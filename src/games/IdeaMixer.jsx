import { useState, useEffect } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

// Fixed combos — each makes intuitive sense for a 6-year-old
const COMBOS = [
  { a: '❄️', b: '☀️', result: '💧', name: 'Water!', hint: 'Ice plus sun...' },
  { a: '🌧️', b: '☀️', result: '🌈', name: 'Rainbow!', hint: 'Rain plus sunshine...' },
  { a: '🍞', b: '🧀', result: '🥪', name: 'Sandwich!', hint: 'Bread plus cheese...' },
  { a: '🐛', b: '🕐', result: '🦋', name: 'Butterfly!', hint: 'Caterpillar plus time...' },
  { a: '🥛', b: '🍫', result: '🍪', name: 'Cookie!', hint: 'Milk plus chocolate...' },
  { a: '🌊', b: '🏖️', result: '🐚', name: 'Seashell!', hint: 'Waves plus beach...' },
  { a: '🌙', b: '⭐', result: '🌌', name: 'Night sky!', hint: 'Moon plus stars...' },
  { a: '🥚', b: '🔥', result: '🍳', name: 'Fried egg!', hint: 'Egg plus fire...' },
  { a: '🌿', b: '💧', result: '🌻', name: 'Flower!', hint: 'Plant plus water...' },
  { a: '🏠', b: '🛞', result: '🚐', name: 'Camper van!', hint: 'House plus wheels...' },
  { a: '🐟', b: '🍣', result: '🍱', name: 'Sushi!', hint: 'Fish plus rice...' },
  { a: '⚡', b: '🌧️', result: '⛈️', name: 'Storm!', hint: 'Lightning plus rain...' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function IdeaMixer({ stars, onAddStars, onHome }) {
  const [comboIndex, setComboIndex] = useState(0);
  const [mixed, setMixed] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const [options, setOptions] = useState([]);

  const combo = COMBOS[comboIndex % COMBOS.length];
  const roundSize = 3;

  useEffect(() => {
    setMixed(false);
    const wrongOptions = shuffle(COMBOS.filter(c => c.result !== combo.result))
      .slice(0, 3)
      .map(c => c.result);
    setOptions(shuffle([combo.result, ...wrongOptions]));
    speak(combo.hint);
  }, [comboIndex]);

  const handleGuess = (choice) => {
    if (mixed) return;
    unlockAudio();
    playTap();
    if (choice === combo.result) {
      setMixed(true);
      playCorrect();
      speak(combo.name);
      onAddStars('mixer', 1);
      const newRound = roundCount + 1;
      setRoundCount(newRound);
      if (newRound % roundSize === 0) {
        setTimeout(() => setShowComplete(true), 1200);
      } else {
        setTimeout(() => setComboIndex(i => i + 1), 1200);
      }
    } else {
      playWrong();
    }
  };

  if (showComplete) {
    return (
      <GameShell title="Idea Mixer" emoji="💡" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={roundSize} onNext={() => { setShowComplete(false); setComboIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Idea Mixer" emoji="💡" stars={stars} onBack={onHome} speakText={combo.hint}>
      <div className="mixer-area">
        <div className="mix-item pop-in">{combo.a}</div>
        <div className="mix-plus">+</div>
        <div className="mix-item pop-in" style={{ animationDelay: '0.15s' }}>{combo.b}</div>
        <div className="mix-plus">=</div>
        <div className="mix-item" style={{ fontSize: mixed ? '4rem' : '2rem' }}>
          {mixed ? (
            <span className="pop-in">{combo.result}</span>
          ) : (
            <span style={{ animation: 'bounce 1s ease-in-out infinite' }}>❓</span>
          )}
        </div>
      </div>

      {mixed && (
        <div className="mix-result">
          <div className="result-name pop-in">{combo.name}</div>
        </div>
      )}

      {!mixed && (
        <div className="options-grid">
          {options.map((opt, i) => (
            <button key={i} className="option-btn" onClick={() => handleGuess(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </GameShell>
  );
}
