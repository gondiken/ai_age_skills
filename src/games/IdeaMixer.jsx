import { useState, useEffect } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak } from '../speak';

// Creative thinking: combine two things to make something new
const COMBOS = [
  { a: '🐴', b: '🦄', result: '🦄', name: 'Unicorn!', hint: 'A horse plus magic...' },
  { a: '🚗', b: '✈️', result: '🚀', name: 'Rocket!', hint: 'A car that can fly really fast...' },
  { a: '🏠', b: '🌊', result: '🚢', name: 'Ship!', hint: 'A house on the water...' },
  { a: '📱', b: '📷', result: '🤳', name: 'Selfie!', hint: 'A phone with a camera...' },
  { a: '🐟', b: '🦅', result: '🐉', name: 'Dragon!', hint: 'Scales and wings together...' },
  { a: '🌙', b: '💡', result: '⭐', name: 'Star!', hint: 'Night sky plus light...' },
  { a: '🍦', b: '🎂', result: '🧁', name: 'Cupcake!', hint: 'Ice cream meets cake...' },
  { a: '🐛', b: '🌺', result: '🦋', name: 'Butterfly!', hint: 'A caterpillar and a flower...' },
  { a: '🎵', b: '📺', result: '🎬', name: 'Movie!', hint: 'Music and a screen...' },
  { a: '🧊', b: '☀️', result: '💧', name: 'Water!', hint: 'Ice in the sun...' },
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
    // Create 4 options with 1 correct
    const wrongOptions = shuffle(COMBOS.filter(c => c.result !== combo.result))
      .slice(0, 3)
      .map(c => c.result);
    setOptions(shuffle([combo.result, ...wrongOptions]));
    speak(combo.hint);
  }, [comboIndex]);

  const handleGuess = (choice) => {
    if (mixed) return;
    if (choice === combo.result) {
      setMixed(true);
      speak(combo.name);
      onAddStars('mixer', 1);
      const newRound = roundCount + 1;
      setRoundCount(newRound);
      if (newRound % roundSize === 0) {
        setTimeout(() => setShowComplete(true), 1200);
      } else {
        setTimeout(() => setComboIndex(i => i + 1), 1500);
      }
    } else {
      speak('Try another one!');
    }
  };

  const handleNext = () => {
    setShowComplete(false);
    setComboIndex(i => i + 1);
  };

  if (showComplete) {
    return (
      <GameShell title="Idea Mixer" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={roundSize} onNext={handleNext} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Idea Mixer"
      stars={stars}
      onBack={onHome}
      speakText={combo.hint}
    >
      <div className="question-text">{combo.hint}</div>

      <div className="mixer-area">
        <div className="mix-item pop-in">{combo.a}</div>
        <div className="mix-plus">+</div>
        <div className="mix-item pop-in" style={{ animationDelay: '0.2s' }}>{combo.b}</div>
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
