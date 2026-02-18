import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

const PUZZLES = [
  // === EASY (1-10): AB alternating patterns, 5 items ===
  { seq: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', choices: ['🔵', '🟢', '🔴', '🟡'], hint: 'Red, blue, red, blue...' },
  { seq: ['🐱', '🐶', '🐱', '🐶', '🐱'], answer: '🐶', choices: ['🐱', '🐶', '🐟', '🐦'], hint: 'Cat, dog, cat, dog...' },
  { seq: ['🍎', '🍌', '🍎', '🍌', '🍎'], answer: '🍌', choices: ['🍎', '🍇', '🍌', '🍊'], hint: 'Apple, banana, apple, banana...' },
  { seq: ['⭐', '🌙', '⭐', '🌙', '⭐'], answer: '🌙', choices: ['⭐', '🌙', '☀️', '🌈'], hint: 'Star, moon, star, moon...' },
  { seq: ['🔺', '🔻', '🔺', '🔻', '🔺'], answer: '🔻', choices: ['🔺', '🔻', '⬛', '🔶'], hint: 'Up, down, up, down...' },
  { seq: ['❤️', '💙', '❤️', '💙', '❤️'], answer: '💙', choices: ['❤️', '💙', '💚', '💛'], hint: 'Red heart, blue heart...' },
  { seq: ['🌞', '🌧️', '🌞', '🌧️', '🌞'], answer: '🌧️', choices: ['🌞', '🌧️', '⛈️', '❄️'], hint: 'Sunny, rainy, sunny, rainy...' },
  { seq: ['🐘', '🐁', '🐘', '🐁', '🐘'], answer: '🐁', choices: ['🐘', '🐁', '🐕', '🐈'], hint: 'Big, small, big, small...' },
  { seq: ['👋', '✊', '👋', '✊', '👋'], answer: '✊', choices: ['👋', '✊', '👍', '✌️'], hint: 'Wave, fist, wave, fist...' },
  { seq: ['🔵', '🟡', '🔵', '🟡', '🔵'], answer: '🟡', choices: ['🔵', '🟡', '🔴', '🟢'], hint: 'Blue, yellow, blue, yellow...' },
  // === MEDIUM (11-20): AAB, ABC, counting patterns ===
  { seq: ['🐸', '🐸', '🦋', '🐸', '🐸'], answer: '🦋', choices: ['🐸', '🦋', '🐝', '🐞'], hint: 'Frog, frog, butterfly, frog, frog...' },
  { seq: ['👏', '👏', '🙌', '👏', '👏'], answer: '🙌', choices: ['👏', '🙌', '✋', '👋'], hint: 'Clap, clap, hands up...' },
  { seq: ['🟡', '🟡', '🟢', '🟡', '🟡'], answer: '🟢', choices: ['🟡', '🟢', '🔵', '🔴'], hint: 'Yellow, yellow, green...' },
  { seq: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], answer: '6️⃣', choices: ['6️⃣', '1️⃣', '7️⃣', '5️⃣'], hint: 'One, two, three, four, five...' },
  { seq: ['🌱', '🌿', '🌳', '🌱', '🌿'], answer: '🌳', choices: ['🌱', '🌿', '🌳', '🌻'], hint: 'Seed, sprout, tree, seed, sprout...' },
  { seq: ['🥚', '🐣', '🐥', '🥚', '🐣'], answer: '🐥', choices: ['🥚', '🐣', '🐥', '🐔'], hint: 'Egg, baby, bird, egg, baby...' },
  { seq: ['🔴', '🟡', '🔵', '🔴', '🟡'], answer: '🔵', choices: ['🔴', '🟡', '🔵', '🟢'], hint: 'Red, yellow, blue, red, yellow...' },
  { seq: ['🐱', '🐶', '🐟', '🐱', '🐶'], answer: '🐟', choices: ['🐱', '🐶', '🐟', '🐦'], hint: 'Cat, dog, fish, cat, dog...' },
  { seq: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️'], answer: '➡️', choices: ['⬆️', '➡️', '⬇️', '⬅️'], hint: 'Up, right, down, left, up...' },
  { seq: ['🍎', '🍊', '🍋', '🍎', '🍊'], answer: '🍋', choices: ['🍎', '🍊', '🍋', '🍇'], hint: 'Apple, orange, lemon, apple, orange...' },
  // === HARD (21-30): AABB, ABBA, ABCD, longer sequences ===
  { seq: ['🔴', '🔴', '🔵', '🔵', '🔴', '🔴'], answer: '🔵', choices: ['🔴', '🔵', '🟢', '🟡'], hint: 'Two red, two blue, two red...' },
  { seq: ['⭐', '🌙', '🌙', '⭐', '⭐', '🌙'], answer: '🌙', choices: ['⭐', '🌙', '☀️', '🌈'], hint: 'Star, moon moon, star, star, moon...' },
  { seq: ['🐸', '🐸', '🐸', '🦋', '🐸', '🐸'], answer: '🐸', choices: ['🐸', '🦋', '🐝', '🐛'], hint: 'Three frogs, butterfly, three frogs...' },
  { seq: ['🔴', '🟡', '🔵', '🟡', '🔴', '🟡'], answer: '🔵', choices: ['🔴', '🟡', '🔵', '🟢'], hint: 'Red, yellow, blue, yellow, red, yellow...' },
  { seq: ['🌱', '🌿', '🌳', '🌿', '🌱', '🌿'], answer: '🌳', choices: ['🌱', '🌿', '🌳', '🌻'], hint: 'Small, medium, big, medium, small...' },
  { seq: ['❄️', '❄️', '☀️', '☀️', '❄️', '❄️'], answer: '☀️', choices: ['❄️', '☀️', '🌧️', '💨'], hint: 'Two cold, two hot, two cold...' },
  { seq: ['🌈', '🌈', '🌈', '⭐', '🌈', '🌈'], answer: '🌈', choices: ['🌈', '⭐', '🌙', '☀️'], hint: 'Three rainbows, star, three rainbows...' },
  { seq: ['🐶', '🐱', '🐟', '🐦', '🐶', '🐱'], answer: '🐟', choices: ['🐶', '🐱', '🐟', '🐦'], hint: 'Dog, cat, fish, bird, dog, cat...' },
  { seq: ['🎵', '🎵', '🎶', '🎶', '🎵', '🎵', '🎶'], answer: '🎶', choices: ['🎵', '🎶', '🥁', '🎺'], hint: 'Two notes, two music, two notes...' },
  { seq: ['🔴', '🟡', '🔵', '🟢', '🔴', '🟡', '🔵'], answer: '🟢', choices: ['🔴', '🟡', '🔵', '🟢'], hint: 'Red, yellow, blue, green, red, yellow, blue...' },
];

const TOTAL_ROUNDS = PUZZLES.length / 3;

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

const BADGE_STYLES = `
  .pattern-badges {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
  .pattern-round {
    font-size: 0.8rem;
    font-weight: 800;
    color: rgba(255,255,255,0.5);
    letter-spacing: 2px;
  }
  .pattern-diff {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 2px;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(255,255,255,0.1);
  }
  .pattern-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 30px 20px;
    text-align: center;
  }
  .pattern-done-title {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #C084FC, #F472B6, #FACC15);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .pattern-done-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    font-weight: 600;
  }
`;

export default function PatternDetective({ stars, currentLevel, onAddStars, onSetLevel, onResetLevel, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(Math.min(currentLevel || 0, PUZZLES.length));
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
      speak('Amazing! You solved all the patterns!');
      return;
    }
    setShuffledChoices(shuffle(puzzle.choices));
    speak(puzzle.hint + ' what comes next?');
  }, [puzzleIndex]);

  useEffect(() => { onSetLevel(puzzleIndex); }, [puzzleIndex]);

  const handleChoice = useCallback((choice) => {
    if (selected !== null) return;
    unlockAudio();
    playTap();
    setSelected(choice);
    if (choice === puzzle.answer) {
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
        const earned = roundStars + (choice === puzzle.answer ? 1 : 0);
        onAddStars('pattern', earned);
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

  // All puzzles complete
  if (allDone) {
    return (
      <GameShell title="PATTERNS" emoji="🔍" stars={stars} onBack={onHome}>
        <style>{BADGE_STYLES}</style>
        <div className="pattern-done">
          <div style={{ fontSize: '5rem' }}>🏆</div>
          <div className="pattern-done-title">ALL PATTERNS SOLVED!</div>
          <div className="pattern-done-sub">YOU ARE A PATTERN MASTER!</div>
          <div style={{ fontSize: '2rem' }}>⭐ {stars} ⭐</div>
          <button className="action-btn" onClick={onHome} style={{ marginTop: 12 }}>
            🏠 HOME
          </button>
          <button className="action-btn" onClick={() => { onResetLevel(); setPuzzleIndex(0); }} style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)' }}>
            🔄 PLAY AGAIN
          </button>
        </div>
      </GameShell>
    );
  }

  if (showComplete) {
    return (
      <GameShell title="PATTERNS" emoji="🔍" stars={stars} onBack={onHome}>
        <LevelComplete
          starsEarned={completedStars}
          onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }}
          onHome={onHome}
        />
      </GameShell>
    );
  }

  const currentRound = Math.floor(puzzleIndex / roundSize) + 1;

  return (
    <GameShell title="PATTERNS" emoji="🔍" stars={stars} onBack={onHome} speakText={puzzle.hint + ' what comes next?'}>
      <style>{BADGE_STYLES}</style>

      <div className="pattern-badges">
        <span className="pattern-round">ROUND {currentRound} / {TOTAL_ROUNDS}</span>
        <span className="pattern-diff" style={{ color: getDifficultyColor(puzzleIndex) }}>
          {getDifficulty(puzzleIndex)}
        </span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((puzzleIndex % roundSize) / roundSize) * 100}%` }} />
      </div>

      <div className="question-text" style={{ fontSize: '1.1rem' }}>WHAT COMES NEXT?</div>

      <div className="sequence-row">
        {puzzle.seq.map((item, i) => (
          <div key={i} className="sequence-item pop-in" style={{ animationDelay: `${i * 0.08}s` }}>
            {item}
          </div>
        ))}
        <div className="sequence-item mystery">❓</div>
      </div>

      <div className="options-grid">
        {shuffledChoices.map((choice, i) => (
          <button
            key={i}
            className={`option-btn ${selected === choice ? (isCorrect ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
