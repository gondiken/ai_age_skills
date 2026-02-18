import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

/* ─── EASY (1-8): 4 steps each ─── */
const EASY = [
  {
    emoji: '🥪', hint: 'MAKE A SANDWICH!',
    steps: [
      { emoji: '🍞', text: 'GET BREAD' },
      { emoji: '🧈', text: 'SPREAD BUTTER' },
      { emoji: '🧀', text: 'ADD CHEESE' },
      { emoji: '🍞', text: 'TOP BREAD' },
    ],
  },
  {
    emoji: '🎨', hint: 'PAINT A PICTURE!',
    steps: [
      { emoji: '📄', text: 'GET PAPER' },
      { emoji: '🎨', text: 'PICK COLORS' },
      { emoji: '🖌️', text: 'PAINT' },
      { emoji: '🖼️', text: 'HANG IT' },
    ],
  },
  {
    emoji: '🌱', hint: 'PLANT A FLOWER!',
    steps: [
      { emoji: '🕳️', text: 'DIG HOLE' },
      { emoji: '🌱', text: 'PUT SEED' },
      { emoji: '🪣', text: 'ADD DIRT' },
      { emoji: '💧', text: 'WATER' },
    ],
  },
  {
    emoji: '🦷', hint: 'BRUSH YOUR TEETH!',
    steps: [
      { emoji: '🪥', text: 'GET BRUSH' },
      { emoji: '🧴', text: 'ADD PASTE' },
      { emoji: '😬', text: 'BRUSH' },
      { emoji: '💦', text: 'RINSE' },
    ],
  },
  {
    emoji: '🎂', hint: 'BAKE A CAKE!',
    steps: [
      { emoji: '🥣', text: 'MIX' },
      { emoji: '🍰', text: 'POUR IN PAN' },
      { emoji: '🔥', text: 'BAKE' },
      { emoji: '🎂', text: 'FROSTING' },
    ],
  },
  {
    emoji: '📬', hint: 'SEND A LETTER!',
    steps: [
      { emoji: '✏️', text: 'WRITE' },
      { emoji: '📨', text: 'ENVELOPE' },
      { emoji: '📮', text: 'STAMP' },
      { emoji: '📭', text: 'MAILBOX' },
    ],
  },
  {
    emoji: '⛄', hint: 'BUILD A SNOWMAN!',
    steps: [
      { emoji: '⬜', text: 'ROLL SNOW' },
      { emoji: '⛄', text: 'STACK BALLS' },
      { emoji: '🥕', text: 'ADD NOSE' },
      { emoji: '🎩', text: 'PUT HAT' },
    ],
  },
  {
    emoji: '🧃', hint: 'MAKE SOME JUICE!',
    steps: [
      { emoji: '🍊', text: 'GET ORANGES' },
      { emoji: '🔪', text: 'CUT THEM' },
      { emoji: '🍊', text: 'SQUEEZE' },
      { emoji: '🥤', text: 'POUR IN CUP' },
    ],
  },
];

/* ─── MEDIUM (9-16): 5 steps each ─── */
const MEDIUM = [
  {
    emoji: '🧼', hint: 'WASH YOUR HANDS!',
    steps: [
      { emoji: '🚰', text: 'TURN ON WATER' },
      { emoji: '💧', text: 'WET HANDS' },
      { emoji: '🧴', text: 'ADD SOAP' },
      { emoji: '🧼', text: 'SCRUB' },
      { emoji: '🧻', text: 'DRY OFF' },
    ],
  },
  {
    emoji: '🐕', hint: 'WASH THE DOG!',
    steps: [
      { emoji: '🛁', text: 'FILL TUB' },
      { emoji: '🐕', text: 'DOG IN TUB' },
      { emoji: '🧴', text: 'ADD SOAP' },
      { emoji: '🧽', text: 'SCRUB' },
      { emoji: '🌬️', text: 'DRY OFF' },
    ],
  },
  {
    emoji: '🍕', hint: 'MAKE A PIZZA!',
    steps: [
      { emoji: '🫓', text: 'ROLL DOUGH' },
      { emoji: '🍅', text: 'ADD SAUCE' },
      { emoji: '🧀', text: 'ADD CHEESE' },
      { emoji: '🔥', text: 'BAKE IT' },
      { emoji: '🔪', text: 'SLICE' },
    ],
  },
  {
    emoji: '🎣', hint: 'GO FISHING!',
    steps: [
      { emoji: '🚗', text: 'DRIVE TO LAKE' },
      { emoji: '🎣', text: 'GET ROD' },
      { emoji: '🪱', text: 'ADD BAIT' },
      { emoji: '🌊', text: 'CAST LINE' },
      { emoji: '🐟', text: 'CATCH FISH' },
    ],
  },
  {
    emoji: '🏠', hint: 'BUILD A BIRDHOUSE!',
    steps: [
      { emoji: '🪵', text: 'GET WOOD' },
      { emoji: '📐', text: 'MEASURE' },
      { emoji: '🪚', text: 'CUT PIECES' },
      { emoji: '🔨', text: 'NAIL TOGETHER' },
      { emoji: '🎨', text: 'PAINT IT' },
    ],
  },
  {
    emoji: '☕', hint: 'MAKE HOT CHOCOLATE!',
    steps: [
      { emoji: '🥛', text: 'POUR MILK' },
      { emoji: '🔥', text: 'HEAT IT UP' },
      { emoji: '🍫', text: 'ADD COCOA' },
      { emoji: '🥄', text: 'STIR' },
      { emoji: '🍡', text: 'ADD MARSHMALLOW' },
    ],
  },
  {
    emoji: '📦', hint: 'MAIL A PACKAGE!',
    steps: [
      { emoji: '📦', text: 'GET BOX' },
      { emoji: '🎁', text: 'PUT GIFT IN' },
      { emoji: '📦', text: 'CLOSE BOX' },
      { emoji: '📋', text: 'TAPE IT' },
      { emoji: '📮', text: 'TAKE TO POST' },
    ],
  },
  {
    emoji: '👚', hint: 'DO THE LAUNDRY!',
    steps: [
      { emoji: '👚', text: 'GET CLOTHES' },
      { emoji: '🫧', text: 'ADD SOAP' },
      { emoji: '🌀', text: 'WASH' },
      { emoji: '☀️', text: 'DRY' },
      { emoji: '👕', text: 'FOLD' },
    ],
  },
];

/* ─── HARD (17-24): 6 steps each ─── */
const HARD = [
  {
    emoji: '🏫', hint: 'GO TO SCHOOL!',
    steps: [
      { emoji: '⏰', text: 'WAKE UP' },
      { emoji: '👕', text: 'GET DRESSED' },
      { emoji: '🥣', text: 'EAT BREAKFAST' },
      { emoji: '🎒', text: 'GRAB BACKPACK' },
      { emoji: '🚶', text: 'WALK TO BUS' },
      { emoji: '🚌', text: 'RIDE TO SCHOOL' },
    ],
  },
  {
    emoji: '🏖️', hint: 'BUILD A SANDCASTLE!',
    steps: [
      { emoji: '🏖️', text: 'GO TO BEACH' },
      { emoji: '⛱️', text: 'FIND A SPOT' },
      { emoji: '🪣', text: 'FILL BUCKET' },
      { emoji: '🪣', text: 'FLIP BUCKET' },
      { emoji: '🏰', text: 'BUILD TOWER' },
      { emoji: '🚩', text: 'PUT FLAG ON TOP' },
    ],
  },
  {
    emoji: '🎬', hint: 'MAKE A MOVIE!',
    steps: [
      { emoji: '📝', text: 'WRITE STORY' },
      { emoji: '🎭', text: 'PICK ACTORS' },
      { emoji: '👗', text: 'WEAR COSTUMES' },
      { emoji: '📹', text: 'FILM IT' },
      { emoji: '✂️', text: 'EDIT' },
      { emoji: '🍿', text: 'WATCH IT' },
    ],
  },
  {
    emoji: '🪁', hint: 'FLY A KITE!',
    steps: [
      { emoji: '🪁', text: 'GET KITE' },
      { emoji: '🌳', text: 'GO TO PARK' },
      { emoji: '🧵', text: 'UNROLL STRING' },
      { emoji: '🏃', text: 'RUN WITH IT' },
      { emoji: '🪁', text: 'LET IT FLY' },
      { emoji: '🧵', text: 'REEL IT BACK' },
    ],
  },
  {
    emoji: '🍳', hint: 'COOK BREAKFAST!',
    steps: [
      { emoji: '🍳', text: 'GET PAN' },
      { emoji: '🧈', text: 'ADD BUTTER' },
      { emoji: '🥚', text: 'CRACK EGGS' },
      { emoji: '🔥', text: 'COOK' },
      { emoji: '🍽️', text: 'PUT ON PLATE' },
      { emoji: '🧂', text: 'ADD SALT' },
    ],
  },
  {
    emoji: '🎉', hint: 'THROW A BIRTHDAY PARTY!',
    steps: [
      { emoji: '📨', text: 'SEND INVITES' },
      { emoji: '🛒', text: 'BUY DECORATIONS' },
      { emoji: '🎈', text: 'DECORATE ROOM' },
      { emoji: '🎂', text: 'BAKE CAKE' },
      { emoji: '👋', text: 'GREET FRIENDS' },
      { emoji: '🎁', text: 'OPEN GIFTS' },
    ],
  },
  {
    emoji: '⛺', hint: 'GO CAMPING!',
    steps: [
      { emoji: '🎒', text: 'PACK GEAR' },
      { emoji: '🚗', text: 'DRIVE THERE' },
      { emoji: '⛺', text: 'SET UP TENT' },
      { emoji: '🪵', text: 'GATHER WOOD' },
      { emoji: '🔥', text: 'MAKE FIRE' },
      { emoji: '🌭', text: 'COOK DINNER' },
    ],
  },
  {
    emoji: '🤖', hint: 'BUILD A ROBOT!',
    steps: [
      { emoji: '📝', text: 'DRAW PLAN' },
      { emoji: '🔩', text: 'GET PARTS' },
      { emoji: '🔧', text: 'BUILD BODY' },
      { emoji: '🔌', text: 'ADD WIRES' },
      { emoji: '💡', text: 'ADD BRAIN' },
      { emoji: '🔋', text: 'POWER ON' },
    ],
  },
];

const PUZZLES = [...EASY, ...MEDIUM, ...HARD];

function getDifficulty(idx) {
  if (idx < 8) return 'EASY';
  if (idx < 16) return 'MEDIUM';
  return 'HARD';
}
function getDifficultyColor(idx) {
  if (idx < 8) return '#4ADE80';
  if (idx < 16) return '#FACC15';
  return '#F87171';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BossBrain({ stars, currentLevel, onAddStars, onSetLevel, onResetLevel, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(Math.min(currentLevel || 0, PUZZLES.length));
  const [placed, setPlaced] = useState([]);
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [completedStars, setCompletedStars] = useState(0);

  const allDone = puzzleIndex >= PUZZLES.length;
  const puzzle = allDone ? null : PUZZLES[puzzleIndex];

  useEffect(() => {
    if (allDone) {
      playCelebrate();
      speak('You finished all Boss Brain levels! You are the boss!');
      return;
    }
    setShuffledSteps(shuffle(puzzle.steps));
    setPlaced([]);
    speak(puzzle.hint);
  }, [puzzleIndex]);

  useEffect(() => { onSetLevel(puzzleIndex); }, [puzzleIndex]);

  const handlePick = useCallback((step) => {
    unlockAudio();
    playTap();
    const nextIndex = placed.length;
    const correctStep = puzzle.steps[nextIndex];
    if (step.text === correctStep.text) {
      const newPlaced = [...placed, step];
      setPlaced(newPlaced);
      playCorrect();
      if (newPlaced.length === puzzle.steps.length) {
        const earned = 2;
        setCompletedStars(earned);
        onAddStars('boss', earned);
        setTimeout(() => setShowComplete(true), 600);
      }
    } else {
      playWrong();
    }
  }, [placed, puzzle, onAddStars]);

  if (allDone) {
    return (
      <GameShell title="BOSS BRAIN" emoji="👑" stars={stars} onBack={onHome}>
        <style>{`
          .bb-done { text-align:center; padding:2rem 1rem; }
          .bb-done-trophy { font-size:5rem; animation: pop 0.5s ease; }
          .bb-done-title { font-size:1.8rem; font-weight:800; margin:1rem 0;
            background:linear-gradient(135deg,#FFD700,#FF6B6B);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .bb-done-sub { font-size:1.2rem; color:var(--text-muted); margin-bottom:1.5rem; }
        `}</style>
        <div className="bb-done">
          <div className="bb-done-trophy">👑</div>
          <div className="bb-done-title">YOU ARE THE BOSS!</div>
          <div className="bb-done-sub">ALL 24 LEVELS COMPLETE</div>
          <button className="game-btn" onClick={onHome}>🏠 HOME</button>
          <button className="game-btn" onClick={() => { onResetLevel(); setPuzzleIndex(0); }} style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)' }}>🔄 PLAY AGAIN</button>
        </div>
      </GameShell>
    );
  }

  if (showComplete) {
    return (
      <GameShell title="BOSS BRAIN" emoji="👑" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={completedStars} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="BOSS BRAIN" emoji="👑" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <style>{`
        .bb-badges { display:flex; justify-content:center; gap:0.5rem; margin-bottom:0.5rem; }
        .bb-level { background:rgba(255,255,255,0.15); padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
        .bb-diff { padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
      `}</style>
      <div className="bb-badges">
        <span className="bb-level">LEVEL {puzzleIndex + 1} / {PUZZLES.length}</span>
        <span className="bb-diff" style={{ background: getDifficultyColor(puzzleIndex), color: '#000' }}>
          {getDifficulty(puzzleIndex)}
        </span>
      </div>

      <div style={{ fontSize: '3rem' }}>{puzzle.emoji}</div>

      <div className="steps-area">
        {puzzle.steps.map((_, i) => (
          <div key={i} className={`step-slot ${i < placed.length ? 'filled' : ''}`}>
            <div className="step-number">{i + 1}</div>
            {i < placed.length ? (
              <span className="pop-in" style={{ fontSize: '1.3rem' }}>{placed[i].emoji} {placed[i].text}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>?</span>
            )}
          </div>
        ))}
      </div>

      <div className="step-choices">
        {shuffledSteps.map((step, i) => {
          const used = placed.some(p => p.text === step.text);
          return (
            <button key={i} className={`step-choice-btn ${used ? 'used' : ''}`} onClick={() => handlePick(step)}>
              <span style={{ fontSize: '1.5rem' }}>{step.emoji}</span> {step.text}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
