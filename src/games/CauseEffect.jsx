import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

/* ─── EASY (1-10): 4 choices, obvious cause-effect ─── */
const EASY = [
  {
    cause: '🌧️', hint: 'IT RAINS A LOT...', answer: '🌊', answerLabel: 'PUDDLES!',
    choices: [{ emoji: '🌊', label: 'PUDDLES' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '❄️', label: 'SNOW' }, { emoji: '🌵', label: 'DESERT' }],
  },
  {
    cause: '☀️', hint: 'ICE CREAM IN THE SUN...', answer: '🫠', answerLabel: 'IT MELTS!',
    choices: [{ emoji: '🫠', label: 'MELTS' }, { emoji: '🧊', label: 'FREEZES' }, { emoji: '💨', label: 'FLIES' }, { emoji: '🎵', label: 'SINGS' }],
  },
  {
    cause: '🌱', hint: 'WATER A SEED EVERY DAY...', answer: '🌻', answerLabel: 'FLOWER!',
    choices: [{ emoji: '🌻', label: 'FLOWER' }, { emoji: '🪨', label: 'ROCK' }, { emoji: '⭐', label: 'STAR' }, { emoji: '🧸', label: 'TEDDY' }],
  },
  {
    cause: '💨', hint: 'STRONG WIND BLOWS...', answer: '🍂', answerLabel: 'LEAVES FALL!',
    choices: [{ emoji: '🍂', label: 'LEAVES FALL' }, { emoji: '🐟', label: 'FISH' }, { emoji: '📚', label: 'BOOKS' }, { emoji: '🎸', label: 'GUITAR' }],
  },
  {
    cause: '🥶', hint: 'IT GETS VERY COLD...', answer: '❄️', answerLabel: 'ICE!',
    choices: [{ emoji: '❄️', label: 'ICE' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '🌺', label: 'FLOWERS' }, { emoji: '🦁', label: 'LION' }],
  },
  {
    cause: '😴', hint: 'YOU STAY UP LATE...', answer: '🥱', answerLabel: 'SLEEPY!',
    choices: [{ emoji: '🥱', label: 'SLEEPY' }, { emoji: '💪', label: 'STRONG' }, { emoji: '🎵', label: 'MUSIC' }, { emoji: '🍕', label: 'PIZZA' }],
  },
  {
    cause: '📚', hint: 'YOU READ EVERY DAY...', answer: '🧠', answerLabel: 'SMARTER!',
    choices: [{ emoji: '🧠', label: 'SMART' }, { emoji: '🦷', label: 'TEETH' }, { emoji: '🧊', label: 'ICE' }, { emoji: '🎈', label: 'BALLOON' }],
  },
  {
    cause: '🔋', hint: 'BATTERY RUNS OUT...', answer: '📵', answerLabel: 'OFF!',
    choices: [{ emoji: '📵', label: 'OFF' }, { emoji: '🚀', label: 'FLIES' }, { emoji: '🎉', label: 'PARTY' }, { emoji: '🌈', label: 'RAINBOW' }],
  },
  {
    cause: '🎈', hint: 'YOU LET GO OF A BALLOON...', answer: '☁️', answerLabel: 'FLIES UP!',
    choices: [{ emoji: '☁️', label: 'FLIES UP' }, { emoji: '🐟', label: 'SWIMS' }, { emoji: '🪨', label: 'SINKS' }, { emoji: '🎵', label: 'SINGS' }],
  },
  {
    cause: '🌞', hint: 'THE SUN GOES DOWN...', answer: '🌙', answerLabel: 'DARK!',
    choices: [{ emoji: '🌙', label: 'DARK' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '🌸', label: 'FLOWERS' }, { emoji: '🏖️', label: 'BEACH' }],
  },
];

/* ─── MEDIUM (11-20): 5 choices, trickier distractors ─── */
const MEDIUM = [
  {
    cause: '🎈', hint: 'BLOW UP BALLOON TOO MUCH...', answer: '💥', answerLabel: 'POP!',
    choices: [{ emoji: '💥', label: 'POP' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🧊', label: 'FREEZES' }, { emoji: '🌱', label: 'GROWS' }, { emoji: '🐟', label: 'SWIMS' }],
  },
  {
    cause: '🐛', hint: 'CATERPILLAR MAKES A COCOON...', answer: '🦋', answerLabel: 'BUTTERFLY!',
    choices: [{ emoji: '🦋', label: 'BUTTERFLY' }, { emoji: '🐟', label: 'FISH' }, { emoji: '🐸', label: 'FROG' }, { emoji: '🐌', label: 'SNAIL' }, { emoji: '🦀', label: 'CRAB' }],
  },
  {
    cause: '🧊', hint: 'LEAVE ICE IN THE SUN...', answer: '💧', answerLabel: 'WATER!',
    choices: [{ emoji: '💧', label: 'WATER' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '🪨', label: 'ROCK' }, { emoji: '🎵', label: 'MUSIC' }],
  },
  {
    cause: '🌵', hint: 'DON\'T WATER THE PLANT...', answer: '🥀', answerLabel: 'IT WILTS!',
    choices: [{ emoji: '🥀', label: 'WILTS' }, { emoji: '🌻', label: 'BLOOMS' }, { emoji: '🌳', label: 'GROWS' }, { emoji: '🍎', label: 'FRUIT' }, { emoji: '🌈', label: 'RAINBOW' }],
  },
  {
    cause: '🐕', hint: 'DOG SEES A SQUIRREL...', answer: '🏃', answerLabel: 'CHASES IT!',
    choices: [{ emoji: '🏃', label: 'CHASES' }, { emoji: '😴', label: 'SLEEPS' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🏊', label: 'SWIMS' }, { emoji: '📚', label: 'READS' }],
  },
  {
    cause: '🍬', hint: 'EAT TOO MUCH CANDY...', answer: '🤢', answerLabel: 'TUMMY ACHE!',
    choices: [{ emoji: '🤢', label: 'TUMMY ACHE' }, { emoji: '💪', label: 'STRONG' }, { emoji: '🧠', label: 'SMART' }, { emoji: '🏃', label: 'FAST' }, { emoji: '😴', label: 'SLEEPY' }],
  },
  {
    cause: '🥛', hint: 'DROP A GLASS ON THE FLOOR...', answer: '💔', answerLabel: 'IT BREAKS!',
    choices: [{ emoji: '💔', label: 'BREAKS' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '💨', label: 'FLIES' }, { emoji: '🔥', label: 'FIRE' }],
  },
  {
    cause: '⏰', hint: 'ALARM CLOCK GOES OFF...', answer: '😳', answerLabel: 'WAKE UP!',
    choices: [{ emoji: '😳', label: 'WAKE UP' }, { emoji: '🍕', label: 'PIZZA' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '🐟', label: 'FISH' }, { emoji: '💃', label: 'DANCE' }],
  },
  {
    cause: '🏋️', hint: 'EXERCISE EVERY DAY...', answer: '💪', answerLabel: 'STRONGER!',
    choices: [{ emoji: '💪', label: 'STRONGER' }, { emoji: '🧊', label: 'FROZEN' }, { emoji: '🎈', label: 'FLOAT' }, { emoji: '🐟', label: 'FISH' }, { emoji: '🎵', label: 'MUSIC' }],
  },
  {
    cause: '🧲', hint: 'MAGNET NEAR METAL...', answer: '📎', answerLabel: 'STICKS!',
    choices: [{ emoji: '📎', label: 'STICKS' }, { emoji: '🔥', label: 'BURNS' }, { emoji: '💨', label: 'BLOWS' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🌊', label: 'SPLASHES' }],
  },
];

/* ─── HARD (21-30): 6 choices, subtler relationships ─── */
const HARD = [
  {
    cause: '🌋', hint: 'A VOLCANO ERUPTS...', answer: '🔥', answerLabel: 'LAVA FLOWS!',
    choices: [{ emoji: '🔥', label: 'LAVA' }, { emoji: '❄️', label: 'SNOW' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '🎵', label: 'MUSIC' }, { emoji: '🐟', label: 'FISH' }, { emoji: '🌺', label: 'FLOWERS' }],
  },
  {
    cause: '🌺', hint: 'BEES VISIT FLOWERS ALL DAY...', answer: '🍯', answerLabel: 'HONEY!',
    choices: [{ emoji: '🍯', label: 'HONEY' }, { emoji: '🧊', label: 'ICE' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '🌊', label: 'WATER' }, { emoji: '🪨', label: 'ROCK' }, { emoji: '💨', label: 'WIND' }],
  },
  {
    cause: '🪨', hint: 'DROP A BIG ROCK IN WATER...', answer: '💦', answerLabel: 'SPLASH!',
    choices: [{ emoji: '💦', label: 'SPLASH' }, { emoji: '🎵', label: 'MUSIC' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '❄️', label: 'ICE' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '💨', label: 'FLOATS' }],
  },
  {
    cause: '🌬️', hint: 'YOU BLOW ON HOT SOUP...', answer: '🥣', answerLabel: 'COOLS DOWN!',
    choices: [{ emoji: '🥣', label: 'COOLS DOWN' }, { emoji: '🔥', label: 'HOTTER' }, { emoji: '💥', label: 'EXPLODES' }, { emoji: '🧊', label: 'FREEZES' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🌈', label: 'RAINBOW' }],
  },
  {
    cause: '🥤', hint: 'SHAKE A SODA CAN AND OPEN IT...', answer: '💥', answerLabel: 'FIZZ EXPLODES!',
    choices: [{ emoji: '💥', label: 'FIZZ BURST' }, { emoji: '🧊', label: 'FREEZES' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '😴', label: 'SLEEPS' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '🌊', label: 'WAVES' }],
  },
  {
    cause: '🐻', hint: 'BEAR EATS A LOT IN FALL...', answer: '😴', answerLabel: 'HIBERNATES!',
    choices: [{ emoji: '😴', label: 'HIBERNATES' }, { emoji: '🏃', label: 'RUNS' }, { emoji: '🏊', label: 'SWIMS' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '🌺', label: 'FLOWERS' }],
  },
  {
    cause: '🎃', hint: 'LEAVE A PUMPKIN OUT TOO LONG...', answer: '🤢', answerLabel: 'IT ROTS!',
    choices: [{ emoji: '🤢', label: 'ROTS' }, { emoji: '🌻', label: 'GROWS' }, { emoji: '❄️', label: 'FREEZES' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🔥', label: 'BURNS' }, { emoji: '🌈', label: 'RAINBOW' }],
  },
  {
    cause: '🔔', hint: 'YOU RING THE DOORBELL...', answer: '🚪', answerLabel: 'DOOR OPENS!',
    choices: [{ emoji: '🚪', label: 'DOOR OPENS' }, { emoji: '💧', label: 'RAIN' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '❄️', label: 'SNOW' }, { emoji: '🎵', label: 'MUSIC' }, { emoji: '💥', label: 'BOOM' }],
  },
  {
    cause: '🌊', hint: 'BIG WAVE HITS THE SANDCASTLE...', answer: '💔', answerLabel: 'FALLS APART!',
    choices: [{ emoji: '💔', label: 'FALLS APART' }, { emoji: '🏰', label: 'GROWS' }, { emoji: '🎵', label: 'SINGS' }, { emoji: '🔥', label: 'BURNS' }, { emoji: '❄️', label: 'FREEZES' }, { emoji: '🌈', label: 'RAINBOW' }],
  },
  {
    cause: '🐓', hint: 'THE ROOSTER CROWS...', answer: '🌅', answerLabel: 'MORNING!',
    choices: [{ emoji: '🌅', label: 'MORNING' }, { emoji: '🌙', label: 'NIGHT' }, { emoji: '🌈', label: 'RAINBOW' }, { emoji: '❄️', label: 'SNOW' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '🎵', label: 'MUSIC' }],
  },
];

const PUZZLES = [...EASY, ...MEDIUM, ...HARD];

function getDifficulty(idx) {
  if (idx < 10) return 'EASY';
  if (idx < 20) return 'MEDIUM';
  return 'HARD';
}
function getDifficultyColor(idx) {
  if (idx < 10) return '#4ADE80';
  if (idx < 20) return '#FACC15';
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

export default function CauseEffect({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [roundStars, setRoundStars] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [completedStars, setCompletedStars] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState([]);

  const allDone = puzzleIndex >= PUZZLES.length;
  const puzzle = allDone ? null : PUZZLES[puzzleIndex];
  const roundSize = 3;

  useEffect(() => {
    if (allDone) {
      playCelebrate();
      speak('You figured out every cause and effect! Amazing thinking!');
      return;
    }
    setShuffledChoices(shuffle(puzzle.choices));
    speak(puzzle.hint + ' What happens?');
  }, [puzzleIndex]);

  const handleChoice = useCallback((choice) => {
    if (selected !== null) return;
    unlockAudio();
    playTap();
    setSelected(choice.emoji);
    if (choice.emoji === puzzle.answer) {
      setIsCorrect(true);
      setRoundStars(s => s + 1);
      playCorrect();
    } else {
      setIsCorrect(false);
      playWrong();
    }
    setTimeout(() => {
      const nextIdx = puzzleIndex + 1;
      if (nextIdx % roundSize === 0 && nextIdx > 0) {
        const earned = roundStars + (choice.emoji === puzzle.answer ? 1 : 0);
        onAddStars('cause', earned);
        setCompletedStars(earned);
        setRoundStars(0);
        setShowComplete(true);
      } else {
        setPuzzleIndex(nextIdx);
      }
      setSelected(null);
      setIsCorrect(null);
    }, 900);
  }, [selected, puzzle, puzzleIndex, roundStars, onAddStars]);

  if (allDone) {
    return (
      <GameShell title="WHAT HAPPENS?" emoji="⚡" stars={stars} onBack={onHome}>
        <style>{`
          .ce-done { text-align:center; padding:2rem 1rem; }
          .ce-done-trophy { font-size:5rem; animation: pop 0.5s ease; }
          .ce-done-title { font-size:1.8rem; font-weight:800; margin:1rem 0;
            background:linear-gradient(135deg,#FFD700,#FF6B6B);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .ce-done-sub { font-size:1.2rem; color:var(--text-muted); margin-bottom:1.5rem; }
        `}</style>
        <div className="ce-done">
          <div className="ce-done-trophy">⚡</div>
          <div className="ce-done-title">CAUSE AND EFFECT MASTER!</div>
          <div className="ce-done-sub">ALL 30 PUZZLES SOLVED</div>
          <button className="game-btn" onClick={onHome}>🏠 HOME</button>
        </div>
      </GameShell>
    );
  }

  if (showComplete) {
    return (
      <GameShell title="WHAT HAPPENS?" emoji="⚡" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={completedStars} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="WHAT HAPPENS?" emoji="⚡" stars={stars} onBack={onHome} speakText={puzzle.hint + ' What happens?'}>
      <style>{`
        .ce-badges { display:flex; justify-content:center; gap:0.5rem; margin-bottom:0.5rem; }
        .ce-level { background:rgba(255,255,255,0.15); padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
        .ce-diff { padding:0.2rem 0.7rem; border-radius:1rem; font-size:0.85rem; font-weight:700; }
      `}</style>
      <div className="ce-badges">
        <span className="ce-level">PUZZLE {puzzleIndex + 1} / {PUZZLES.length}</span>
        <span className="ce-diff" style={{ background: getDifficultyColor(puzzleIndex), color: '#000' }}>
          {getDifficulty(puzzleIndex)}
        </span>
      </div>

      <div className="cause-card">
        <div className="cause-emoji">{puzzle.cause}</div>
        <div className="cause-text">{puzzle.hint}</div>
      </div>

      <div className="effect-options">
        {shuffledChoices.map((choice, i) => (
          <button
            key={i}
            className={`effect-btn ${selected === choice.emoji ? (isCorrect ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleChoice(choice)}
          >
            {choice.emoji}
            <span className="effect-label">{choice.label}</span>
          </button>
        ))}
      </div>
    </GameShell>
  );
}
