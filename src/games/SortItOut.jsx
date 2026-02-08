import { useState, useEffect, useRef, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  { hint: 'SKY OR WATER?', bucketA: { emoji: '☁️', label: 'SKY', items: ['🦅', '✈️', '🎈', '🌙'] }, bucketB: { emoji: '🌊', label: 'WATER', items: ['🐟', '🐙', '🚢', '🐳'] } },
  { hint: 'HOT OR COLD?', bucketA: { emoji: '🔥', label: 'HOT', items: ['☀️', '🌶️', '🍳', '🌋'] }, bucketB: { emoji: '❄️', label: 'COLD', items: ['🧊', '⛄', '🍦', '🐧'] } },
  { hint: 'DAY OR NIGHT?', bucketA: { emoji: '🌞', label: 'DAY', items: ['🏫', '🦋', '🌻', '🏖️'] }, bucketB: { emoji: '🌙', label: 'NIGHT', items: ['⭐', '🦉', '🛏️', '🌌'] } },
  { hint: 'FRUIT OR VEGGIE?', bucketA: { emoji: '🍎', label: 'FRUIT', items: ['🍌', '🍇', '🍊', '🍓'] }, bucketB: { emoji: '🥦', label: 'VEGGIE', items: ['🥕', '🌽', '🥬', '🍆'] } },
  { hint: 'BIG OR SMALL?', bucketA: { emoji: '🐘', label: 'BIG', items: ['🏠', '🌳', '🚌', '🦕'] }, bucketB: { emoji: '🐜', label: 'SMALL', items: ['🐛', '🍒', '🔑', '🐝'] } },
  { hint: 'FAST OR SLOW?', bucketA: { emoji: '🚀', label: 'FAST', items: ['⚡', '🏎️', '🦅', '🐆'] }, bucketB: { emoji: '🐌', label: 'SLOW', items: ['🐢', '🦥', '🐌', '🧊'] } },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- inline <style> for .sort-* classes ---------- */
const SORT_STYLES = `
  /* ---- conveyor belt ---- */
  .sort-conveyor {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    background: rgba(255,255,255,0.07);
    border-radius: 30px;
    min-height: 38px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .sort-conveyor-item {
    font-size: 1.35rem;
    opacity: 0.45;
    transition: opacity 0.3s, transform 0.3s;
  }
  .sort-conveyor-item--active {
    opacity: 1;
    transform: scale(1.15);
  }
  .sort-conveyor-item--done {
    opacity: 0.18;
    transform: scale(0.8);
  }

  /* ---- falling item ---- */
  .sort-stage {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    margin: 8px 0 4px;
  }
  .sort-falling {
    font-size: 3.8rem;
    animation: sort-drop 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    will-change: transform, opacity;
  }
  @keyframes sort-drop {
    0%   { transform: translateY(-80px) scale(0.5); opacity: 0; }
    60%  { transform: translateY(8px) scale(1.08); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }

  /* wrong shake */
  .sort-shake {
    animation: sort-shake-anim 0.45s ease;
  }
  @keyframes sort-shake-anim {
    0%, 100% { transform: translateX(0); }
    15%  { transform: translateX(-14px) rotate(-4deg); }
    30%  { transform: translateX(12px) rotate(3deg); }
    45%  { transform: translateX(-10px) rotate(-2deg); }
    60%  { transform: translateX(8px) rotate(1deg); }
    75%  { transform: translateX(-4px); }
  }

  /* correct: shrink into bin */
  .sort-pop-correct {
    animation: sort-pop-shrink 0.45s cubic-bezier(0.55, 0, 1, 0.45) forwards;
  }
  @keyframes sort-pop-shrink {
    0%   { transform: scale(1); opacity: 1; }
    30%  { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(0) translateY(60px); opacity: 0; }
  }

  /* ---- bins area ---- */
  .sort-bins {
    display: flex;
    gap: 18px;
    width: 100%;
    max-width: 440px;
    justify-content: center;
    margin-top: auto;
    padding-bottom: 8px;
  }

  .sort-bin {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: white;
    transition: transform 0.18s;
    -webkit-tap-highlight-color: transparent;
  }
  .sort-bin:active {
    transform: scale(0.95);
  }

  .sort-bin-svg-wrap {
    position: relative;
    width: 100%;
    max-width: 170px;
    transition: filter 0.3s, transform 0.25s;
  }
  .sort-bin--correct .sort-bin-svg-wrap {
    filter: drop-shadow(0 0 12px rgba(74,222,128,0.6));
    transform: scale(1.04);
  }
  .sort-bin--wrong .sort-bin-svg-wrap {
    filter: drop-shadow(0 0 10px rgba(255,80,80,0.5));
    animation: sort-bin-wobble 0.35s ease;
  }
  @keyframes sort-bin-wobble {
    0%, 100% { transform: rotate(0); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
  }

  .sort-bin-label {
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.85);
    margin-top: -2px;
  }

  .sort-bin-emoji {
    position: absolute;
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    pointer-events: none;
  }

  .sort-bin-sorted {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: center;
    position: absolute;
    bottom: 20%;
    left: 10%;
    right: 10%;
    pointer-events: none;
  }
  .sort-bin-sorted-item {
    font-size: 1.15rem;
    animation: sort-item-land 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  @keyframes sort-item-land {
    0%   { transform: scale(0); opacity: 0; }
    60%  { transform: scale(1.4); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* ---- hint ---- */
  .sort-hint {
    font-size: 1.3rem;
    font-weight: 700;
    color: rgba(255,255,255,0.92);
    text-align: center;
    margin: 2px 0 0;
  }
`;

/* ---------- SVG Bucket component ---------- */
function BucketSVG({ colorTop, colorBody }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      {/* bucket body */}
      <path
        d="M20 40 L10 125 C10 133 20 140 40 140 L120 140 C140 140 150 133 150 125 L140 40 Z"
        fill={colorBody}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2.5"
      />
      {/* inner shadow */}
      <path
        d="M28 48 L20 120 C20 126 30 132 45 132 L115 132 C130 132 140 126 140 120 L132 48 Z"
        fill="rgba(0,0,0,0.12)"
      />
      {/* rim / top band */}
      <rect x="14" y="32" rx="6" ry="6" width="132" height="16" fill={colorTop} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* handle */}
      <path
        d="M50 32 Q80 -2 110 32"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function SortItOut({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [sortedA, setSortedA] = useState([]);
  const [sortedB, setSortedB] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'a' | 'b' | 'wrong' | null
  const [showComplete, setShowComplete] = useState(false);
  const [itemAnimClass, setItemAnimClass] = useState('sort-falling');
  const busyRef = useRef(false);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];

  useEffect(() => {
    const allItems = [
      ...puzzle.bucketA.items.map(e => ({ emoji: e, bucket: 'a' })),
      ...puzzle.bucketB.items.map(e => ({ emoji: e, bucket: 'b' })),
    ];
    setItems(shuffle(allItems));
    setCurrentItem(0);
    setSortedA([]);
    setSortedB([]);
    setFeedback(null);
    setItemAnimClass('sort-falling');
    busyRef.current = false;
    speak(puzzle.hint);
  }, [puzzleIndex]);

  const handleSort = useCallback((toBucket) => {
    if (busyRef.current) return;
    if (currentItem >= items.length) return;
    busyRef.current = true;
    unlockAudio();
    playTap();

    const item = items[currentItem];
    const isCorrect = item.bucket === toBucket;

    if (isCorrect) {
      playCorrect();
      setFeedback(toBucket);
      setItemAnimClass('sort-pop-correct');

      if (toBucket === 'a') setSortedA(s => [...s, item.emoji]);
      else setSortedB(s => [...s, item.emoji]);

      setTimeout(() => {
        setFeedback(null);
        const nextItem = currentItem + 1;
        setCurrentItem(nextItem);
        setItemAnimClass('sort-falling');
        busyRef.current = false;

        if (nextItem >= items.length) {
          onAddStars('sort', 2);
          setTimeout(() => setShowComplete(true), 400);
        }
      }, 500);
    } else {
      playWrong();
      setFeedback('wrong');
      setItemAnimClass('sort-shake');

      setTimeout(() => {
        setFeedback(null);
        setItemAnimClass('sort-falling');
        busyRef.current = false;
      }, 500);
    }
  }, [currentItem, items, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="SORT IT" emoji="📦" stars={stars} onBack={onHome}>
        <LevelComplete
          starsEarned={2}
          onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }}
          onHome={onHome}
        />
      </GameShell>
    );
  }

  const done = currentItem >= items.length;
  const binAState = feedback === 'a' ? 'sort-bin--correct' : feedback === 'wrong' ? '' : '';
  const binBState = feedback === 'b' ? 'sort-bin--correct' : feedback === 'wrong' ? '' : '';

  return (
    <GameShell title="SORT IT" emoji="📦" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <style>{SORT_STYLES}</style>

      {/* progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentItem / items.length) * 100}%` }} />
      </div>

      {/* hint */}
      <p className="sort-hint">{puzzle.hint}</p>

      {/* conveyor belt showing all items */}
      <div className="sort-conveyor">
        {items.map((itm, i) => (
          <span
            key={i}
            className={
              'sort-conveyor-item' +
              (i === currentItem ? ' sort-conveyor-item--active' : '') +
              (i < currentItem ? ' sort-conveyor-item--done' : '')
            }
          >
            {itm.emoji}
          </span>
        ))}
      </div>

      {/* falling item stage */}
      <div className="sort-stage">
        {!done && (
          <span className={itemAnimClass} key={`${puzzleIndex}-${currentItem}`}>
            {items[currentItem]?.emoji}
          </span>
        )}
      </div>

      {/* two bins */}
      <div className="sort-bins">
        {/* Bucket A */}
        <button
          className={`sort-bin ${feedback === 'a' ? 'sort-bin--correct' : ''} ${feedback === 'wrong' ? 'sort-bin--wrong' : ''}`}
          onClick={() => handleSort('a')}
        >
          <div className="sort-bin-svg-wrap">
            <BucketSVG colorTop="rgba(100,160,255,0.7)" colorBody="rgba(60,120,220,0.45)" />
            <span className="sort-bin-emoji">{puzzle.bucketA.emoji}</span>
            <div className="sort-bin-sorted">
              {sortedA.map((e, i) => (
                <span key={i} className="sort-bin-sorted-item">{e}</span>
              ))}
            </div>
          </div>
          <span className="sort-bin-label">{puzzle.bucketA.label}</span>
        </button>

        {/* Bucket B */}
        <button
          className={`sort-bin ${feedback === 'b' ? 'sort-bin--correct' : ''} ${feedback === 'wrong' ? 'sort-bin--wrong' : ''}`}
          onClick={() => handleSort('b')}
        >
          <div className="sort-bin-svg-wrap">
            <BucketSVG colorTop="rgba(255,140,100,0.7)" colorBody="rgba(220,100,60,0.45)" />
            <span className="sort-bin-emoji">{puzzle.bucketB.emoji}</span>
            <div className="sort-bin-sorted">
              {sortedB.map((e, i) => (
                <span key={i} className="sort-bin-sorted-item">{e}</span>
              ))}
            </div>
          </div>
          <span className="sort-bin-label">{puzzle.bucketB.label}</span>
        </button>
      </div>
    </GameShell>
  );
}
