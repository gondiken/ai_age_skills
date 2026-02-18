import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

/* ─── EASY (1-8): 4 steps + 2 wrong ─── */
const EASY = [
  {
    scene: '🤖', hint: 'TELL THE ROBOT TO COOK!',
    steps: [
      { emoji: '🚶', text: 'GO KITCHEN' },
      { emoji: '🍳', text: 'GET PAN' },
      { emoji: '🥚', text: 'CRACK EGG' },
      { emoji: '🔥', text: 'COOK' },
    ],
    wrong: [{ emoji: '🛁', text: 'BATH' }, { emoji: '📖', text: 'READ' }],
  },
  {
    scene: '🐕', hint: 'TEACH THE DOG A TRICK!',
    steps: [
      { emoji: '👀', text: 'LOOK' },
      { emoji: '🫴', text: 'SHOW TREAT' },
      { emoji: '🗣️', text: 'SAY SIT' },
      { emoji: '🦴', text: 'GIVE TREAT' },
    ],
    wrong: [{ emoji: '🏃', text: 'RUN' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🎮', hint: 'TELL A FRIEND TO PLAY!',
    steps: [
      { emoji: '📺', text: 'TURN ON TV' },
      { emoji: '🎮', text: 'GET CONTROLLER' },
      { emoji: '▶️', text: 'PRESS START' },
      { emoji: '🕹️', text: 'MOVE STICK' },
    ],
    wrong: [{ emoji: '🧹', text: 'SWEEP' }, { emoji: '🍎', text: 'EAT APPLE' }],
  },
  {
    scene: '🧸', hint: 'WRAP A GIFT!',
    steps: [
      { emoji: '🎁', text: 'GET GIFT' },
      { emoji: '📃', text: 'GET PAPER' },
      { emoji: '✂️', text: 'CUT' },
      { emoji: '🎀', text: 'ADD BOW' },
    ],
    wrong: [{ emoji: '🧊', text: 'ICE' }, { emoji: '🔔', text: 'RING BELL' }],
  },
  {
    scene: '🧹', hint: 'TELL THE ROBOT TO CLEAN!',
    steps: [
      { emoji: '🧹', text: 'GET BROOM' },
      { emoji: '🧹', text: 'SWEEP FLOOR' },
      { emoji: '🧽', text: 'GET MOP' },
      { emoji: '🫧', text: 'MOP FLOOR' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🎤', text: 'SING' }],
  },
  {
    scene: '🐱', hint: 'HELP THE CAT GET DOWN!',
    steps: [
      { emoji: '🪜', text: 'GET LADDER' },
      { emoji: '🧗', text: 'CLIMB UP' },
      { emoji: '🐱', text: 'GRAB CAT' },
      { emoji: '⬇️', text: 'CLIMB DOWN' },
    ],
    wrong: [{ emoji: '🏊', text: 'SWIM' }, { emoji: '🎨', text: 'PAINT' }],
  },
  {
    scene: '✈️', hint: 'MAKE A PAPER PLANE!',
    steps: [
      { emoji: '📄', text: 'GET PAPER' },
      { emoji: '📐', text: 'FOLD IT' },
      { emoji: '✈️', text: 'MAKE WINGS' },
      { emoji: '💨', text: 'THROW IT' },
    ],
    wrong: [{ emoji: '🧴', text: 'GLUE' }, { emoji: '💧', text: 'WATER' }],
  },
  {
    scene: '🌱', hint: 'TELL ROBOT TO WATER PLANTS!',
    steps: [
      { emoji: '🪴', text: 'FIND PLANTS' },
      { emoji: '🚰', text: 'GET WATER' },
      { emoji: '🌱', text: 'POUR ON PLANTS' },
      { emoji: '☀️', text: 'PUT IN SUN' },
    ],
    wrong: [{ emoji: '💃', text: 'DANCE' }, { emoji: '😴', text: 'SLEEP' }],
  },
];

/* ─── MEDIUM (9-16): 5 steps + 3 wrong ─── */
const MEDIUM = [
  {
    scene: '🍽️', hint: 'TELL ROBOT TO WASH DISHES!',
    steps: [
      { emoji: '🚰', text: 'FILL SINK' },
      { emoji: '🧴', text: 'ADD SOAP' },
      { emoji: '🧽', text: 'SCRUB DISHES' },
      { emoji: '💦', text: 'RINSE' },
      { emoji: '🧻', text: 'DRY THEM' },
    ],
    wrong: [{ emoji: '🎤', text: 'SING' }, { emoji: '🤸', text: 'JUMP' }, { emoji: '🎨', text: 'PAINT' }],
  },
  {
    scene: '🏰', hint: 'BUILD A BLANKET FORT!',
    steps: [
      { emoji: '🛏️', text: 'GET BLANKETS' },
      { emoji: '🪑', text: 'FIND CHAIRS' },
      { emoji: '🏗️', text: 'DRAPE OVER' },
      { emoji: '📎', text: 'CLIP EDGES' },
      { emoji: '🏰', text: 'CRAWL INSIDE' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🏊', text: 'SWIM' }, { emoji: '🕳️', text: 'DIG' }],
  },
  {
    scene: '🚗', hint: 'TELL ROBOT TO WASH THE CAR!',
    steps: [
      { emoji: '🪣', text: 'GET BUCKET' },
      { emoji: '💧', text: 'FILL WITH WATER' },
      { emoji: '🧴', text: 'SOAP THE CAR' },
      { emoji: '🧽', text: 'SCRUB IT' },
      { emoji: '🚿', text: 'RINSE OFF' },
    ],
    wrong: [{ emoji: '🎨', text: 'PAINT' }, { emoji: '✈️', text: 'FLY' }, { emoji: '🎤', text: 'SING' }],
  },
  {
    scene: '🐦', hint: 'HELP A BIRD BUILD A NEST!',
    steps: [
      { emoji: '🌿', text: 'FIND TWIGS' },
      { emoji: '🐦', text: 'CARRY THEM' },
      { emoji: '🪺', text: 'WEAVE TOGETHER' },
      { emoji: '🍃', text: 'ADD LEAVES' },
      { emoji: '🥚', text: 'LAY EGGS' },
    ],
    wrong: [{ emoji: '🏊', text: 'SWIM' }, { emoji: '🕳️', text: 'DIG' }, { emoji: '🐕', text: 'BARK' }],
  },
  {
    scene: '📸', hint: 'TELL ROBOT TO TAKE A PHOTO!',
    steps: [
      { emoji: '📷', text: 'GET CAMERA' },
      { emoji: '🔛', text: 'TURN IT ON' },
      { emoji: '👆', text: 'POINT AT THING' },
      { emoji: '😁', text: 'SAY CHEESE' },
      { emoji: '📸', text: 'CLICK' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🧹', text: 'SWEEP' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🍋', hint: 'SET UP A LEMONADE STAND!',
    steps: [
      { emoji: '🍋', text: 'SQUEEZE LEMONS' },
      { emoji: '🍬', text: 'ADD SUGAR' },
      { emoji: '💧', text: 'ADD WATER' },
      { emoji: '🪑', text: 'SET UP TABLE' },
      { emoji: '🥤', text: 'POUR IN CUPS' },
    ],
    wrong: [{ emoji: '🎨', text: 'PAINT' }, { emoji: '😴', text: 'SLEEP' }, { emoji: '🕳️', text: 'DIG' }],
  },
  {
    scene: '🚲', hint: 'TELL ROBOT TO FIX THE BIKE!',
    steps: [
      { emoji: '🔄', text: 'FLIP BIKE OVER' },
      { emoji: '🔍', text: 'FIND THE HOLE' },
      { emoji: '🩹', text: 'PUT ON PATCH' },
      { emoji: '🎈', text: 'PUMP AIR' },
      { emoji: '🔄', text: 'FLIP BACK' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🎤', text: 'SING' }, { emoji: '📖', text: 'READ' }],
  },
  {
    scene: '🎄', hint: 'DECORATE THE CHRISTMAS TREE!',
    steps: [
      { emoji: '🎄', text: 'GET TREE' },
      { emoji: '🪵', text: 'STAND IT UP' },
      { emoji: '🔴', text: 'HANG ORNAMENTS' },
      { emoji: '💡', text: 'WRAP LIGHTS' },
      { emoji: '⭐', text: 'STAR ON TOP' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '😴', text: 'SLEEP' }, { emoji: '🕳️', text: 'DIG' }],
  },
];

/* ─── HARD (17-24): 6 steps + 4 wrong ─── */
const HARD = [
  {
    scene: '🚀', hint: 'HELP THE ASTRONAUT GO TO SPACE!',
    steps: [
      { emoji: '🧑‍🚀', text: 'PUT ON SUIT' },
      { emoji: '🚀', text: 'GET IN ROCKET' },
      { emoji: '🪢', text: 'BUCKLE UP' },
      { emoji: '🔢', text: 'COUNT DOWN' },
      { emoji: '🔥', text: 'BLAST OFF' },
      { emoji: '🌌', text: 'FLOAT IN SPACE' },
    ],
    wrong: [{ emoji: '🏊', text: 'SWIM' }, { emoji: '🍳', text: 'COOK' }, { emoji: '🎨', text: 'PAINT' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🍪', hint: 'TELL ROBOT TO BAKE COOKIES!',
    steps: [
      { emoji: '🥣', text: 'GET BOWL' },
      { emoji: '🥄', text: 'MIX DOUGH' },
      { emoji: '🫓', text: 'ROLL INTO BALLS' },
      { emoji: '🍪', text: 'PUT ON TRAY' },
      { emoji: '🔥', text: 'BAKE IN OVEN' },
      { emoji: '❄️', text: 'LET COOL' },
    ],
    wrong: [{ emoji: '🎨', text: 'PAINT' }, { emoji: '🏊', text: 'SWIM' }, { emoji: '🕳️', text: 'DIG' }, { emoji: '🎤', text: 'SING' }],
  },
  {
    scene: '🏴‍☠️', hint: 'HELP THE PIRATE FIND TREASURE!',
    steps: [
      { emoji: '🗺️', text: 'READ MAP' },
      { emoji: '⛵', text: 'SAIL THE SHIP' },
      { emoji: '🏝️', text: 'LAND ON ISLAND' },
      { emoji: '🚶', text: 'FOLLOW PATH' },
      { emoji: '⛏️', text: 'DIG HOLE' },
      { emoji: '💰', text: 'OPEN CHEST' },
    ],
    wrong: [{ emoji: '✈️', text: 'FLY' }, { emoji: '🍳', text: 'COOK' }, { emoji: '😴', text: 'SLEEP' }, { emoji: '🎤', text: 'SING' }],
  },
  {
    scene: '🎨', hint: 'TELL ROBOT TO PAINT A ROOM!',
    steps: [
      { emoji: '🎨', text: 'PICK COLOR' },
      { emoji: '🛒', text: 'BUY PAINT' },
      { emoji: '📋', text: 'TAPE EDGES' },
      { emoji: '🪣', text: 'POUR IN TRAY' },
      { emoji: '🖌️', text: 'ROLL ON WALL' },
      { emoji: '⏳', text: 'LET DRY' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🏊', text: 'SWIM' }, { emoji: '😴', text: 'SLEEP' }, { emoji: '🎤', text: 'SING' }],
  },
  {
    scene: '🚒', hint: 'HELP THE FIREFIGHTER SAVE A CAT!',
    steps: [
      { emoji: '🔔', text: 'HEAR ALARM' },
      { emoji: '🧑‍🚒', text: 'SLIDE DOWN POLE' },
      { emoji: '🚒', text: 'JUMP IN TRUCK' },
      { emoji: '🚗', text: 'DRIVE TO TREE' },
      { emoji: '🪜', text: 'RAISE LADDER' },
      { emoji: '🐱', text: 'RESCUE CAT' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🏊', text: 'SWIM' }, { emoji: '🎨', text: 'PAINT' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🐠', hint: 'TELL ROBOT TO SET UP FISH TANK!',
    steps: [
      { emoji: '🫙', text: 'GET TANK' },
      { emoji: '🪨', text: 'ADD ROCKS' },
      { emoji: '💧', text: 'FILL WITH WATER' },
      { emoji: '🌿', text: 'PUT IN PLANT' },
      { emoji: '🔌', text: 'ADD FILTER' },
      { emoji: '🐠', text: 'PUT FISH IN' },
    ],
    wrong: [{ emoji: '🎨', text: 'PAINT' }, { emoji: '✈️', text: 'FLY' }, { emoji: '🎤', text: 'SING' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🍲', hint: 'HELP THE CHEF MAKE SOUP!',
    steps: [
      { emoji: '🍲', text: 'GET BIG POT' },
      { emoji: '💧', text: 'FILL WITH WATER' },
      { emoji: '🔪', text: 'CHOP VEGETABLES' },
      { emoji: '🥕', text: 'PUT THEM IN' },
      { emoji: '🔥', text: 'HEAT IT UP' },
      { emoji: '🥣', text: 'SERVE IN BOWL' },
    ],
    wrong: [{ emoji: '🎨', text: 'PAINT' }, { emoji: '✈️', text: 'FLY' }, { emoji: '🎤', text: 'SING' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🎪', hint: 'HELP SET UP THE CIRCUS!',
    steps: [
      { emoji: '🚛', text: 'DRIVE TRUCK IN' },
      { emoji: '⛺', text: 'PUT UP BIG TENT' },
      { emoji: '🪑', text: 'SET UP SEATS' },
      { emoji: '💡', text: 'TURN ON LIGHTS' },
      { emoji: '🎶', text: 'START MUSIC' },
      { emoji: '🤡', text: 'SEND IN CLOWNS' },
    ],
    wrong: [{ emoji: '🍳', text: 'COOK' }, { emoji: '🏊', text: 'SWIM' }, { emoji: '😴', text: 'SLEEP' }, { emoji: '🕳️', text: 'DIG' }],
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

export default function StoryMachine({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [allChoices, setAllChoices] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [completedStars, setCompletedStars] = useState(0);

  const allDone = puzzleIndex >= PUZZLES.length;
  const puzzle = allDone ? null : PUZZLES[puzzleIndex];

  useEffect(() => {
    if (allDone) {
      playCelebrate();
      speak('You finished all Story Machine levels! Amazing instructions!');
      return;
    }
    setAllChoices(shuffle([...puzzle.steps, ...puzzle.wrong]));
    setPlaced([]);
    speak(puzzle.hint);
  }, [puzzleIndex]);

  const handlePick = useCallback((choice) => {
    const nextIndex = placed.length;
    if (nextIndex >= puzzle.steps.length) return;
    unlockAudio();
    playTap();
    const correctStep = puzzle.steps[nextIndex];
    if (choice.text === correctStep.text) {
      const newPlaced = [...placed, choice];
      setPlaced(newPlaced);
      playCorrect();
      if (newPlaced.length === puzzle.steps.length) {
        const earned = 2;
        setCompletedStars(earned);
        onAddStars('story', earned);
        setTimeout(() => setShowComplete(true), 600);
      }
    } else {
      playWrong();
    }
  }, [placed, puzzle, onAddStars]);

  if (allDone) {
    return (
      <GameShell title="STORY MACHINE" emoji="🤖" stars={stars} onBack={onHome}>
        <style>{`
          .sm-done { text-align:center; padding:2rem 1rem; }
          .sm-done-trophy { font-size:5rem; animation: pop 0.5s ease; }
          .sm-done-title { font-size:1.8rem; font-weight:800; margin:1rem 0;
            background:linear-gradient(135deg,#FFD700,#FF6B6B);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .sm-done-sub { font-size:1.2rem; color:var(--text-muted); margin-bottom:1.5rem; }
        `}</style>
        <div className="sm-done">
          <div className="sm-done-trophy">🤖</div>
          <div className="sm-done-title">MASTER INSTRUCTOR!</div>
          <div className="sm-done-sub">ALL 24 LEVELS COMPLETE</div>
          <button className="game-btn" onClick={onHome}>🏠 HOME</button>
        </div>
      </GameShell>
    );
  }

  if (showComplete) {
    return (
      <GameShell title="STORY MACHINE" emoji="🤖" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={completedStars} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="STORY MACHINE" emoji="🤖" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <style>{`
        .sm-badges { display:flex; justify-content:center; gap:0.5rem; margin-bottom:0.5rem; }
        .sm-level { background:rgba(255,255,255,0.15); padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
        .sm-diff { padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
      `}</style>
      <div className="sm-badges">
        <span className="sm-level">LEVEL {puzzleIndex + 1} / {PUZZLES.length}</span>
        <span className="sm-diff" style={{ background: getDifficultyColor(puzzleIndex), color: '#000' }}>
          {getDifficulty(puzzleIndex)}
        </span>
      </div>

      <div style={{ fontSize: '4rem' }}>{puzzle.scene}</div>

      <div className="instruction-slots">
        {puzzle.steps.map((_, i) => (
          <div key={i} className={`instruction-slot ${i < placed.length ? 'filled' : ''}`}>
            <span className="slot-arrow">{i < placed.length ? '✅' : `${i + 1}`}</span>
            {i < placed.length ? (
              <span className="pop-in"><span style={{ fontSize: '1.3rem' }}>{placed[i].emoji}</span> {placed[i].text}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>?</span>
            )}
          </div>
        ))}
      </div>

      <div className="instruction-choices">
        {allChoices.map((choice, i) => {
          const used = placed.some(p => p.text === choice.text);
          return (
            <button key={i} className={`instruction-choice ${used ? 'used' : ''}`} onClick={() => handlePick(choice)}>
              <span style={{ fontSize: '1.3rem' }}>{choice.emoji}</span> {choice.text}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
