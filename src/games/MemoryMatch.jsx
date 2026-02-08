import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const CARD_SETS = [
  ['🐶', '🐱', '🐸', '🦋', '🐙', '🦊'],
  ['🍎', '🍌', '🍇', '🍒', '🥝', '🍊'],
  ['🚗', '🚀', '✈️', '🚢', '🚲', '🛸'],
  ['⭐', '🌙', '☀️', '🌈', '⚡', '❄️'],
  ['🎸', '🥁', '🎹', '🎺', '🎻', '🪗'],
  ['🏠', '🏰', '⛺', '🛖', '🗼', '🎪'],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STYLES = `
  .memory-moves {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 10px;
    user-select: none;
    letter-spacing: 2px;
  }

  .memory-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 360px;
  }

  .memory-card {
    aspect-ratio: 1;
    perspective: 600px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .memory-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
    transform-style: preserve-3d;
    border-radius: 14px;
  }

  .memory-card--flipped .memory-card-inner {
    transform: rotateY(180deg);
  }

  .memory-card-front,
  .memory-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .memory-card-front {
    transform: rotateY(180deg);
    background: var(--card-bg, #1e1b4b);
    border: 3px solid rgba(255, 255, 255, 0.15);
    font-size: 2.2rem;
  }

  .memory-card-back {
    background:
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        rgba(255, 255, 255, 0.12) 0deg 15deg,
        transparent 15deg 30deg
      ),
      linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f59e0b 100%);
    border: 3px solid rgba(255, 255, 255, 0.3);
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .memory-card--matched .memory-card-front {
    border-color: #4ade80;
    box-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
    animation: memory-pulse 2s ease-in-out infinite;
  }

  .memory-card--celebrate {
    animation: memory-celebrate 0.5s ease;
  }

  .memory-card--shake {
    animation: memory-shake 0.45s ease;
  }

  @keyframes memory-celebrate {
    0%, 100% { transform: scale(1); }
    30% { transform: scale(1.18); }
    60% { transform: scale(0.95); }
    80% { transform: scale(1.05); }
  }

  @keyframes memory-shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-8px); }
    30% { transform: translateX(8px); }
    45% { transform: translateX(-6px); }
    60% { transform: translateX(6px); }
    75% { transform: translateX(-3px); }
    90% { transform: translateX(3px); }
  }

  @keyframes memory-pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(74, 222, 128, 0.4); }
    50% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.7); }
  }
`;

export default function MemoryMatch({ stars, onAddStars, onHome }) {
  const [setIndex, setSetIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mismatched, setMismatched] = useState([]);
  const [celebrating, setCelebrating] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const [moves, setMoves] = useState(0);

  const cardSet = CARD_SETS[setIndex % CARD_SETS.length];
  // Use 4 pairs (8 cards) for a 6-year-old — not too many
  const pairCount = 4;

  useEffect(() => {
    const picked = shuffle(cardSet).slice(0, pairCount);
    const pairs = shuffle([...picked, ...picked]);
    setCards(pairs.map((emoji, i) => ({ id: i, emoji })));
    setFlipped([]);
    setMatched([]);
    setMismatched([]);
    setCelebrating([]);
    setCanFlip(true);
    setMoves(0);
    speak('Find the matching pairs!');
  }, [setIndex]);

  const handleFlip = useCallback((id) => {
    if (!canFlip) return;
    if (flipped.includes(id) || matched.includes(id)) return;
    unlockAudio();
    playTap();

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;

      if (cards[a].emoji === cards[b].emoji) {
        // Match found — celebrate then mark as matched
        playCorrect();
        setCelebrating([a, b]);
        setTimeout(() => {
          setCelebrating([]);
          const newMatched = [...matched, a, b];
          setMatched(newMatched);
          setFlipped([]);
          setCanFlip(true);
          if (newMatched.length === cards.length) {
            onAddStars('memory', 2);
            setTimeout(() => setShowComplete(true), 600);
          }
        }, 550);
      } else {
        // No match — shake then flip back
        playWrong();
        setTimeout(() => {
          setMismatched([a, b]);
        }, 200);
        setTimeout(() => {
          setMismatched([]);
          setFlipped([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  }, [flipped, matched, cards, canFlip, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="Memory" emoji="🧠" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setSetIndex((i) => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Memory" emoji="🧠" stars={stars} onBack={onHome} speakText="Find the matching pairs!">
      <style>{STYLES}</style>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(matched.length / cards.length) * 100}%` }} />
      </div>

      <div className="memory-moves">👆 {moves}</div>

      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          const isShaking = mismatched.includes(card.id);
          const isCelebrating = celebrating.includes(card.id);

          const classes = [
            'memory-card',
            isFlipped && 'memory-card--flipped',
            isMatched && 'memory-card--matched',
            isShaking && 'memory-card--shake',
            isCelebrating && 'memory-card--celebrate',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={card.id}
              className={classes}
              onClick={() => handleFlip(card.id)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">{card.emoji}</div>
                <div className="memory-card-back">⭐</div>
              </div>
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
