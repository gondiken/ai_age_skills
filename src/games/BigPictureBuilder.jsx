import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

const PUZZLES = [
  // === EASY (1-8): 4 correct, 2 wrong ===
  {
    emoji: '🏠', hint: 'WHAT DO YOU NEED TO BUILD A HOUSE?',
    correct: ['🧱', '🪟', '🚪', '🔨'], wrong: ['🐟', '🎸'],
    labels: { '🧱': 'BRICKS', '🪟': 'WINDOW', '🚪': 'DOOR', '🔨': 'HAMMER', '🐟': 'FISH', '🎸': 'GUITAR' },
  },
  {
    emoji: '🌳', hint: 'WHAT DOES A TREE NEED TO GROW?',
    correct: ['🌱', '☀️', '💧', '🪴'], wrong: ['🔑', '📺'],
    labels: { '🌱': 'SEED', '☀️': 'SUN', '💧': 'WATER', '🪴': 'SOIL', '🔑': 'KEY', '📺': 'TV' },
  },
  {
    emoji: '🍕', hint: 'WHAT DO YOU NEED FOR PIZZA?',
    correct: ['🫓', '🧀', '🍅', '🔥'], wrong: ['🧸', '📚'],
    labels: { '🫓': 'DOUGH', '🧀': 'CHEESE', '🍅': 'SAUCE', '🔥': 'OVEN', '🧸': 'TEDDY', '📚': 'BOOKS' },
  },
  {
    emoji: '🚗', hint: 'WHAT DOES A CAR NEED?',
    correct: ['⛽', '🛞', '🔑', '🛣️'], wrong: ['🌂', '🎈'],
    labels: { '⛽': 'GAS', '🛞': 'WHEELS', '🔑': 'KEY', '🛣️': 'ROAD', '🌂': 'UMBRELLA', '🎈': 'BALLOON' },
  },
  {
    emoji: '🎵', hint: 'WHAT DO YOU NEED TO PLAY MUSIC?',
    correct: ['🎸', '🎵', '🙌', '👂'], wrong: ['🧊', '🗑️'],
    labels: { '🎸': 'GUITAR', '🎵': 'NOTES', '🙌': 'HANDS', '👂': 'EARS', '🧊': 'ICE', '🗑️': 'TRASH' },
  },
  {
    emoji: '📦', hint: 'WHAT DO YOU NEED TO SEND A BOX?',
    correct: ['📦', '📝', '📮', '🚚'], wrong: ['🧹', '🎲'],
    labels: { '📦': 'BOX', '📝': 'ADDRESS', '📮': 'MAILBOX', '🚚': 'TRUCK', '🧹': 'BROOM', '🎲': 'DICE' },
  },
  {
    emoji: '🎂', hint: 'WHAT DO YOU NEED FOR A BIRTHDAY?',
    correct: ['🎂', '🕯️', '🎁', '🎈'], wrong: ['🔨', '☁️'],
    labels: { '🎂': 'CAKE', '🕯️': 'CANDLES', '🎁': 'GIFT', '🎈': 'BALLOONS', '🔨': 'HAMMER', '☁️': 'CLOUD' },
  },
  {
    emoji: '🏖️', hint: 'WHAT DO YOU NEED FOR THE BEACH?',
    correct: ['☀️', '🧴', '🩱', '🌊'], wrong: ['🛏️', '✏️'],
    labels: { '☀️': 'SUN', '🧴': 'SUNSCREEN', '🩱': 'SWIMSUIT', '🌊': 'WAVES', '🛏️': 'BED', '✏️': 'PENCIL' },
  },
  // === MEDIUM (9-16): 4 correct, 3 wrong ===
  {
    emoji: '🧑‍🍳', hint: 'WHAT DO YOU NEED TO COOK?',
    correct: ['🍳', '🔥', '🥄', '🥕'], wrong: ['🛏️', '⚽', '📖'],
    labels: { '🍳': 'PAN', '🔥': 'FIRE', '🥄': 'SPOON', '🥕': 'FOOD', '🛏️': 'BED', '⚽': 'BALL', '📖': 'BOOK' },
  },
  {
    emoji: '🎒', hint: 'WHAT DO YOU NEED FOR SCHOOL?',
    correct: ['🎒', '✏️', '📖', '👩‍🏫'], wrong: ['🐟', '🌋', '🥁'],
    labels: { '🎒': 'BACKPACK', '✏️': 'PENCIL', '📖': 'BOOK', '👩‍🏫': 'TEACHER', '🐟': 'FISH', '🌋': 'VOLCANO', '🥁': 'DRUM' },
  },
  {
    emoji: '😴', hint: 'WHAT DO YOU NEED FOR BEDTIME?',
    correct: ['👕', '🛏️', '📖', '🌙'], wrong: ['⚽', '🔨', '🎸'],
    labels: { '👕': 'PAJAMAS', '🛏️': 'BED', '📖': 'STORY', '🌙': 'MOON', '⚽': 'SOCCER', '🔨': 'HAMMER', '🎸': 'GUITAR' },
  },
  {
    emoji: '🐕', hint: 'WHAT DOES A PET DOG NEED?',
    correct: ['🦴', '🥣', '💧', '❤️'], wrong: ['🚗', '🚀', '🎹'],
    labels: { '🦴': 'BONE', '🥣': 'FOOD', '💧': 'WATER', '❤️': 'LOVE', '🚗': 'CAR', '🚀': 'ROCKET', '🎹': 'PIANO' },
  },
  {
    emoji: '🌧️', hint: 'WHAT MAKES A RAINSTORM?',
    correct: ['☁️', '🌧️', '💨', '⚡'], wrong: ['☀️', '🍦', '🎸'],
    labels: { '☁️': 'CLOUDS', '🌧️': 'RAIN', '💨': 'WIND', '⚡': 'LIGHTNING', '☀️': 'SUN', '🍦': 'ICE CREAM', '🎸': 'GUITAR' },
  },
  {
    emoji: '🎄', hint: 'WHAT DO YOU NEED FOR CHRISTMAS?',
    correct: ['🎄', '⭐', '🎁', '💡'], wrong: ['🍉', '🏄', '🐟'],
    labels: { '🎄': 'TREE', '⭐': 'STAR', '🎁': 'GIFTS', '💡': 'LIGHTS', '🍉': 'MELON', '🏄': 'SURFING', '🐟': 'FISH' },
  },
  {
    emoji: '🏥', hint: 'WHAT DOES A DOCTOR NEED?',
    correct: ['🩺', '💊', '🩹', '🛏️'], wrong: ['🍪', '🛹', '🎈'],
    labels: { '🩺': 'STETHOSCOPE', '💊': 'MEDICINE', '🩹': 'BANDAGE', '🛏️': 'BED', '🍪': 'COOKIE', '🛹': 'SKATEBOARD', '🎈': 'BALLOON' },
  },
  {
    emoji: '🚀', hint: 'WHAT DO YOU NEED FOR SPACE?',
    correct: ['🚀', '🧑‍🚀', '⭐', '🪖'], wrong: ['🐟', '🌳', '🛏️'],
    labels: { '🚀': 'ROCKET', '🧑‍🚀': 'ASTRONAUT', '⭐': 'STARS', '🪖': 'HELMET', '🐟': 'FISH', '🌳': 'TREE', '🛏️': 'BED' },
  },
  // === HARD (17-24): 5 correct, 3 wrong ===
  {
    emoji: '🌊', hint: 'WHAT LIVES IN THE OCEAN?',
    correct: ['🐟', '🪸', '🦀', '🐙', '🐚'], wrong: ['🐦', '🌳', '🌋'],
    labels: { '🐟': 'FISH', '🪸': 'CORAL', '🦀': 'CRAB', '🐙': 'OCTOPUS', '🐚': 'SHELL', '🐦': 'BIRD', '🌳': 'TREE', '🌋': 'VOLCANO' },
  },
  {
    emoji: '🏫', hint: 'WHAT HAPPENS AT SCHOOL?',
    correct: ['🚌', '👩‍🏫', '🍎', '👫', '📚'], wrong: ['🚀', '💎', '🌋'],
    labels: { '🚌': 'BUS', '👩‍🏫': 'TEACHER', '🍎': 'LUNCH', '👫': 'FRIENDS', '📚': 'BOOKS', '🚀': 'ROCKET', '💎': 'DIAMOND', '🌋': 'VOLCANO' },
  },
  {
    emoji: '🌻', hint: 'WHAT DOES A GARDEN NEED?',
    correct: ['🪴', '🌱', '💧', '☀️', '🐝'], wrong: ['📺', '📱', '🚗'],
    labels: { '🪴': 'SOIL', '🌱': 'SEEDS', '💧': 'WATER', '☀️': 'SUN', '🐝': 'BEES', '📺': 'TV', '📱': 'PHONE', '🚗': 'CAR' },
  },
  {
    emoji: '🎬', hint: 'WHAT DO YOU NEED FOR A MOVIE?',
    correct: ['🎥', '🎭', '📺', '🍿', '🎟️'], wrong: ['🔨', '🩺', '🐕'],
    labels: { '🎥': 'CAMERA', '🎭': 'ACTORS', '📺': 'SCREEN', '🍿': 'POPCORN', '🎟️': 'TICKETS', '🔨': 'HAMMER', '🩺': 'DOCTOR', '🐕': 'DOG' },
  },
  {
    emoji: '🏕️', hint: 'WHAT DO YOU NEED FOR CAMPING?',
    correct: ['⛺', '🔥', '🎒', '🔦', '🌲'], wrong: ['📺', '🛁', '🏢'],
    labels: { '⛺': 'TENT', '🔥': 'FIRE', '🎒': 'BACKPACK', '🔦': 'FLASHLIGHT', '🌲': 'FOREST', '📺': 'TV', '🛁': 'BATHTUB', '🏢': 'BUILDING' },
  },
  {
    emoji: '🎉', hint: 'WHAT DO YOU NEED FOR A PARTY?',
    correct: ['🎈', '🎂', '🎵', '👫', '🎊'], wrong: ['🔨', '🩺', '🚜'],
    labels: { '🎈': 'BALLOONS', '🎂': 'CAKE', '🎵': 'MUSIC', '👫': 'FRIENDS', '🎊': 'CONFETTI', '🔨': 'HAMMER', '🩺': 'DOCTOR', '🚜': 'TRACTOR' },
  },
  {
    emoji: '🦁', hint: 'WHAT DO YOU FIND AT THE ZOO?',
    correct: ['🦁', '🐘', '🦒', '🐵', '🎟️'], wrong: ['🛏️', '🍳', '🛹'],
    labels: { '🦁': 'LION', '🐘': 'ELEPHANT', '🦒': 'GIRAFFE', '🐵': 'MONKEY', '🎟️': 'TICKETS', '🛏️': 'BED', '🍳': 'PAN', '🛹': 'SKATEBOARD' },
  },
  {
    emoji: '🌍', hint: 'WHAT DOES EARTH NEED?',
    correct: ['💧', '💨', '🌳', '🐾', '☀️'], wrong: ['💎', '🤖', '🚀'],
    labels: { '💧': 'WATER', '💨': 'AIR', '🌳': 'TREES', '🐾': 'ANIMALS', '☀️': 'SUN', '💎': 'DIAMOND', '🤖': 'ROBOT', '🚀': 'ROCKET' },
  },
];

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

const BP_STYLES = `
  .bp-badges {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    margin-bottom: 4px;
  }
  .bp-level {
    font-size: 0.8rem;
    font-weight: 800;
    color: rgba(255,255,255,0.5);
    letter-spacing: 2px;
  }
  .bp-diff {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 2px;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(255,255,255,0.1);
  }
  .bp-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 30px 20px;
    text-align: center;
  }
  .bp-done-title {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #818CF8, #C084FC, #F472B6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .bp-done-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    font-weight: 600;
  }
`;

export default function BigPictureBuilder({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedParts, setSelectedParts] = useState([]);
  const [wrongPick, setWrongPick] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [allParts, setAllParts] = useState([]);

  const allDone = puzzleIndex >= PUZZLES.length;
  const puzzle = allDone ? null : PUZZLES[puzzleIndex];

  useEffect(() => {
    if (allDone) {
      playCelebrate();
      speak('Amazing! You found all the parts!');
      return;
    }
    setAllParts(shuffle([...puzzle.correct, ...puzzle.wrong]));
    setSelectedParts([]);
    speak(puzzle.hint);
  }, [puzzleIndex]);

  const handlePick = useCallback((part) => {
    if (selectedParts.includes(part)) return;
    unlockAudio();
    playTap();
    if (puzzle.correct.includes(part)) {
      const newSelected = [...selectedParts, part];
      setSelectedParts(newSelected);
      playCorrect();
      if (newSelected.length === puzzle.correct.length) {
        onAddStars('systems', 2);
        setTimeout(() => setShowComplete(true), 600);
      }
    } else {
      setWrongPick(part);
      playWrong();
      setTimeout(() => setWrongPick(null), 600);
    }
  }, [selectedParts, puzzle, onAddStars]);

  // All puzzles complete
  if (allDone) {
    return (
      <GameShell title="BIG PICTURE" emoji="🧩" stars={stars} onBack={onHome}>
        <style>{BP_STYLES}</style>
        <div className="bp-done">
          <div style={{ fontSize: '5rem' }}>🏆</div>
          <div className="bp-done-title">ALL PUZZLES COMPLETE!</div>
          <div className="bp-done-sub">YOU SEE THE BIG PICTURE!</div>
          <div style={{ fontSize: '2rem' }}>⭐ {stars} ⭐</div>
          <button className="action-btn" onClick={onHome} style={{ marginTop: 12 }}>
            🏠 HOME
          </button>
        </div>
      </GameShell>
    );
  }

  if (showComplete) {
    return (
      <GameShell title="BIG PICTURE" emoji="🧩" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="BIG PICTURE" emoji="🧩" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <style>{BP_STYLES}</style>
      <div className="system-board">
        <div className="bp-badges">
          <span className="bp-level">LEVEL {puzzleIndex + 1} / {PUZZLES.length}</span>
          <span className="bp-diff" style={{ color: getDifficultyColor(puzzleIndex) }}>
            {getDifficulty(puzzleIndex)}
          </span>
        </div>

        <div className="system-scenario">
          <div style={{ fontSize: '3.5rem' }}>{puzzle.emoji}</div>
          <div className="question-text" style={{ fontSize: '0.95rem', marginTop: 6 }}>PICK THE RIGHT PARTS!</div>
        </div>

        <div className="progress-bar" style={{ margin: '0 auto' }}>
          <div className="progress-fill" style={{ width: `${(selectedParts.length / puzzle.correct.length) * 100}%` }} />
        </div>

        <div className="system-parts">
          {allParts.map((part, i) => (
            <button
              key={i}
              className={`system-part ${selectedParts.includes(part) ? 'selected' : ''} ${wrongPick === part ? 'wrong-pick' : ''}`}
              onClick={() => handlePick(part)}
            >
              {part}
              <span className="part-label">{puzzle.labels[part]}</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
