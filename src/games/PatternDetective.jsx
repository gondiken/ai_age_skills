import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  { seq: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', choices: ['🔵', '🟢', '🔴', '🟡'], hint: 'Red, blue, red, blue...' },
  { seq: ['🐱', '🐶', '🐱', '🐶', '🐱'], answer: '🐶', choices: ['🐱', '🐶', '🐟', '🐦'], hint: 'Cat, dog, cat, dog...' },
  { seq: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️'], answer: '➡️', choices: ['⬇️', '➡️', '⬆️', '⬅️'], hint: 'Up, right, down, left, up...' },
  { seq: ['🌙', '🌙', '⭐', '🌙', '🌙'], answer: '⭐', choices: ['🌙', '⭐', '☀️', '🌈'], hint: 'Moon, moon, star, moon, moon...' },
  { seq: ['🍎', '🍌', '🍎', '🍌', '🍎'], answer: '🍌', choices: ['🍎', '🍇', '🍌', '🍊'], hint: 'Apple, banana, apple, banana...' },
  { seq: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], answer: '6️⃣', choices: ['6️⃣', '1️⃣', '7️⃣', '5️⃣'], hint: 'One, two, three, four, five...' },
  { seq: ['🐸', '🐸', '🦋', '🐸', '🐸'], answer: '🦋', choices: ['🐸', '🦋', '🐝', '🐞'], hint: 'Frog, frog, butterfly...' },
  { seq: ['👏', '👏', '🙌', '👏', '👏'], answer: '🙌', choices: ['👏', '🙌', '✋', '👋'], hint: 'Clap, clap, hands up...' },
  { seq: ['🔺', '🔻', '🔺', '🔻', '🔺'], answer: '🔻', choices: ['🔺', '🔻', '⬛', '🔶'], hint: 'Up, down, up, down...' },
  { seq: ['🟡', '🟡', '🟢', '🟡', '🟡'], answer: '🟢', choices: ['🟡', '🟢', '🔵', '🔴'], hint: 'Yellow, yellow, green...' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PatternDetective({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [roundStars, setRoundStars] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];
  const roundSize = 3;

  useEffect(() => {
    setShuffledChoices(shuffle(puzzle.choices));
    speak(puzzle.hint + ' what comes next?');
  }, [puzzleIndex]);

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
        setRoundStars(0);
        setShowComplete(true);
      } else {
        setPuzzleIndex(nextIdx);
      }
      setSelected(null);
      setIsCorrect(null);
    }, 900);
  }, [selected, puzzle, puzzleIndex, roundStars, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="Patterns" emoji="🔍" stars={stars} onBack={onHome}>
        <LevelComplete
          starsEarned={Math.min(roundSize, roundStars + (isCorrect ? 1 : 0))}
          onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }}
          onHome={onHome}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Patterns" emoji="🔍" stars={stars} onBack={onHome} speakText={puzzle.hint + ' what comes next?'}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((puzzleIndex % roundSize) / roundSize) * 100}%` }} />
      </div>

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
