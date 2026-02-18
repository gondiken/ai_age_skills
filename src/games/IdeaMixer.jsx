import { useState, useEffect } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

/* ─── EASY (1-12): obvious combos, 4 choices ─── */
const EASY = [
  { a: '❄️', b: '☀️', result: '💧', name: 'WATER!', hint: 'ICE PLUS SUN...' },
  { a: '🌧️', b: '☀️', result: '🌈', name: 'RAINBOW!', hint: 'RAIN PLUS SUNSHINE...' },
  { a: '🍞', b: '🧀', result: '🥪', name: 'SANDWICH!', hint: 'BREAD PLUS CHEESE...' },
  { a: '🐛', b: '🕐', result: '🦋', name: 'BUTTERFLY!', hint: 'CATERPILLAR PLUS TIME...' },
  { a: '🥛', b: '🍫', result: '🍪', name: 'COOKIE!', hint: 'MILK PLUS CHOCOLATE...' },
  { a: '🌊', b: '🏖️', result: '🐚', name: 'SEASHELL!', hint: 'WAVES PLUS BEACH...' },
  { a: '🌙', b: '⭐', result: '🌌', name: 'NIGHT SKY!', hint: 'MOON PLUS STARS...' },
  { a: '🥚', b: '🔥', result: '🍳', name: 'FRIED EGG!', hint: 'EGG PLUS FIRE...' },
  { a: '🌿', b: '💧', result: '🌻', name: 'FLOWER!', hint: 'PLANT PLUS WATER...' },
  { a: '🏠', b: '🛞', result: '🚐', name: 'CAMPER VAN!', hint: 'HOUSE PLUS WHEELS...' },
  { a: '🐟', b: '🍚', result: '🍱', name: 'SUSHI!', hint: 'FISH PLUS RICE...' },
  { a: '⚡', b: '🌧️', result: '⛈️', name: 'STORM!', hint: 'LIGHTNING PLUS RAIN...' },
];

/* ─── MEDIUM (13-24): trickier combos, 5 choices ─── */
const MEDIUM = [
  { a: '🍌', b: '🥛', result: '🥤', name: 'SMOOTHIE!', hint: 'BANANA PLUS MILK...' },
  { a: '🐔', b: '🪺', result: '🐣', name: 'BABY CHICK!', hint: 'CHICKEN PLUS NEST...' },
  { a: '🌾', b: '🔥', result: '🍿', name: 'POPCORN!', hint: 'CORN PLUS HEAT...' },
  { a: '💧', b: '❄️', result: '🧊', name: 'ICE CUBE!', hint: 'WATER PLUS COLD...' },
  { a: '🪵', b: '🔥', result: '🏕️', name: 'CAMPFIRE!', hint: 'WOOD PLUS FIRE...' },
  { a: '☁️', b: '❄️', result: '🌨️', name: 'SNOW!', hint: 'CLOUDS PLUS COLD...' },
  { a: '🌱', b: '☀️', result: '🌳', name: 'TREE!', hint: 'SEED PLUS SUNSHINE...' },
  { a: '🧱', b: '🧱', result: '🏰', name: 'CASTLE!', hint: 'BLOCKS PLUS BLOCKS...' },
  { a: '🎺', b: '🥁', result: '🎵', name: 'MUSIC!', hint: 'TRUMPET PLUS DRUMS...' },
  { a: '🐸', b: '👑', result: '🤴', name: 'PRINCE!', hint: 'FROG PLUS CROWN...' },
  { a: '🐑', b: '✂️', result: '🧶', name: 'WOOL!', hint: 'SHEEP PLUS SCISSORS...' },
  { a: '🍓', b: '🍰', result: '🎂', name: 'BIRTHDAY CAKE!', hint: 'STRAWBERRY PLUS CAKE...' },
];

/* ─── HARD (25-36): more abstract combos, 6 choices ─── */
const HARD = [
  { a: '🐴', b: '🌈', result: '🦄', name: 'UNICORN!', hint: 'HORSE PLUS RAINBOW...' },
  { a: '🌍', b: '🔥', result: '🌋', name: 'VOLCANO!', hint: 'EARTH PLUS FIRE...' },
  { a: '🎃', b: '🕯️', result: '👻', name: 'HALLOWEEN!', hint: 'PUMPKIN PLUS CANDLE...' },
  { a: '🐻', b: '❄️', result: '🐻‍❄️', name: 'POLAR BEAR!', hint: 'BEAR PLUS ICE...' },
  { a: '🌺', b: '🐝', result: '🍯', name: 'HONEY!', hint: 'FLOWER PLUS BEE...' },
  { a: '🌬️', b: '☁️', result: '🌪️', name: 'TORNADO!', hint: 'WIND PLUS CLOUDS...' },
  { a: '🧪', b: '🧪', result: '💥', name: 'EXPLOSION!', hint: 'POTION PLUS POTION...' },
  { a: '🧊', b: '🍬', result: '🍦', name: 'ICE CREAM!', hint: 'ICE PLUS SWEET...' },
  { a: '🐓', b: '☀️', result: '🌅', name: 'SUNRISE!', hint: 'ROOSTER PLUS SUN...' },
  { a: '🦕', b: '🪨', result: '🦴', name: 'FOSSIL!', hint: 'DINOSAUR PLUS ROCK...' },
  { a: '🌊', b: '🐚', result: '🧜‍♀️', name: 'MERMAID!', hint: 'OCEAN PLUS SHELL...' },
  { a: '🧊', b: '🌊', result: '🏔️', name: 'ICEBERG!', hint: 'ICE PLUS OCEAN...' },
];

const COMBOS = [...EASY, ...MEDIUM, ...HARD];

function getDifficulty(idx) {
  if (idx < 12) return 'EASY';
  if (idx < 24) return 'MEDIUM';
  return 'HARD';
}
function getDifficultyColor(idx) {
  if (idx < 12) return '#4ADE80';
  if (idx < 24) return '#FACC15';
  return '#F87171';
}
function getWrongCount(idx) {
  if (idx < 12) return 3;
  if (idx < 24) return 4;
  return 5;
}

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
  const [completedStars, setCompletedStars] = useState(0);

  const allDone = comboIndex >= COMBOS.length;
  const combo = allDone ? null : COMBOS[comboIndex];
  const roundSize = 3;

  useEffect(() => {
    if (allDone) {
      playCelebrate();
      speak('You mixed every idea! You are a creative genius!');
      return;
    }
    setMixed(false);
    const numWrong = getWrongCount(comboIndex);
    const wrongOptions = shuffle(COMBOS.filter(c => c.result !== combo.result))
      .slice(0, numWrong)
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
        setCompletedStars(roundSize);
        setTimeout(() => setShowComplete(true), 1200);
      } else {
        setTimeout(() => setComboIndex(i => i + 1), 1200);
      }
    } else {
      playWrong();
    }
  };

  if (allDone) {
    return (
      <GameShell title="IDEA MIXER" emoji="💡" stars={stars} onBack={onHome}>
        <style>{`
          .im-done { text-align:center; padding:2rem 1rem; }
          .im-done-trophy { font-size:5rem; animation: pop 0.5s ease; }
          .im-done-title { font-size:1.8rem; font-weight:800; margin:1rem 0;
            background:linear-gradient(135deg,#FFD700,#FF6B6B);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .im-done-sub { font-size:1.2rem; color:var(--text-muted); margin-bottom:1.5rem; }
        `}</style>
        <div className="im-done">
          <div className="im-done-trophy">💡</div>
          <div className="im-done-title">CREATIVE GENIUS!</div>
          <div className="im-done-sub">ALL 36 COMBOS MIXED</div>
          <button className="game-btn" onClick={onHome}>🏠 HOME</button>
        </div>
      </GameShell>
    );
  }

  if (showComplete) {
    return (
      <GameShell title="IDEA MIXER" emoji="💡" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={completedStars} onNext={() => { setShowComplete(false); setComboIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="IDEA MIXER" emoji="💡" stars={stars} onBack={onHome} speakText={combo.hint}>
      <style>{`
        .im-badges { display:flex; justify-content:center; gap:0.5rem; margin-bottom:0.5rem; }
        .im-level { background:rgba(255,255,255,0.15); padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
        .im-diff { padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
      `}</style>
      <div className="im-badges">
        <span className="im-level">COMBO {comboIndex + 1} / {COMBOS.length}</span>
        <span className="im-diff" style={{ background: getDifficultyColor(comboIndex), color: '#000' }}>
          {getDifficulty(comboIndex)}
        </span>
      </div>

      <div className="question-text" style={{ fontSize: '1rem' }}>WHAT DO YOU GET?</div>

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
