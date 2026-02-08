import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  {
    scene: '🤖', hint: 'Tell the robot to cook!',
    steps: [
      { emoji: '🚶', text: 'GO KITCHEN' },
      { emoji: '🍳', text: 'GET PAN' },
      { emoji: '🥚', text: 'CRACK EGG' },
      { emoji: '🔥', text: 'COOK' },
    ],
    wrong: [{ emoji: '🛁', text: 'BATH' }, { emoji: '📖', text: 'READ' }],
  },
  {
    scene: '🐕', hint: 'Teach the dog a trick!',
    steps: [
      { emoji: '👀', text: 'LOOK' },
      { emoji: '🫴', text: 'SHOW TREAT' },
      { emoji: '🗣️', text: 'SAY SIT' },
      { emoji: '🦴', text: 'GIVE TREAT' },
    ],
    wrong: [{ emoji: '🏃', text: 'RUN' }, { emoji: '😴', text: 'SLEEP' }],
  },
  {
    scene: '🎮', hint: 'Tell a friend to play!',
    steps: [
      { emoji: '📺', text: 'TURN ON TV' },
      { emoji: '🎮', text: 'GET CONTROLLER' },
      { emoji: '▶️', text: 'PRESS START' },
      { emoji: '🕹️', text: 'MOVE STICK' },
    ],
    wrong: [{ emoji: '🧹', text: 'SWEEP' }, { emoji: '🍎', text: 'EAT APPLE' }],
  },
  {
    scene: '🧸', hint: 'Wrap a gift!',
    steps: [
      { emoji: '🎁', text: 'GET GIFT' },
      { emoji: '📃', text: 'GET PAPER' },
      { emoji: '✂️', text: 'CUT' },
      { emoji: '🎀', text: 'ADD BOW' },
    ],
    wrong: [{ emoji: '🧊', text: 'ICE' }, { emoji: '🔔', text: 'RING BELL' }],
  },
];

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

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];

  useEffect(() => {
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
        onAddStars('story', 2);
        setTimeout(() => setShowComplete(true), 600);
      }
    } else {
      playWrong();
    }
  }, [placed, puzzle, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="STORY MACHINE" emoji="🤖" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="STORY MACHINE" emoji="🤖" stars={stars} onBack={onHome} speakText={puzzle.hint}>
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
