import { useState, useEffect } from 'react';
import './App.css';
import { useProgress } from './useProgress';
import { speak, initSpeech, unlockAudio } from './speak';
import { playTap } from './sounds';
import Mascot from './Mascot';
import VoicePicker from './VoicePicker';
import CreatureGarden from './CreatureGarden';
import PatternDetective from './games/PatternDetective';
import BigPictureBuilder from './games/BigPictureBuilder';
import BossBrain from './games/BossBrain';
import StoryMachine from './games/StoryMachine';
import IdeaMixer from './games/IdeaMixer';
import CauseEffect from './games/CauseEffect';
import SortItOut from './games/SortItOut';
import CodeBot from './games/CodeBot';

const GAMES = [
  { id: 'pattern', title: 'PATTERNS', icon: '🔍', color: 'pink', Component: PatternDetective },
  { id: 'systems', title: 'BIG PICTURE', icon: '🧩', color: 'purple', Component: BigPictureBuilder },
  { id: 'boss', title: 'BOSS BRAIN', icon: '👑', color: 'green', Component: BossBrain },
  { id: 'story', title: 'STORY MACHINE', icon: '📋', color: 'blue', Component: StoryMachine },
  { id: 'mixer', title: 'IDEA MIXER', icon: '💡', color: 'orange', Component: IdeaMixer },
  { id: 'cause', title: 'WHAT HAPPENS?', icon: '⚡', color: 'yellow', Component: CauseEffect },
  { id: 'sort', title: 'SORT IT', icon: '📦', color: 'pink', Component: SortItOut },
  { id: 'codebot', title: 'CODE BOT', icon: '🤖', color: 'purple', Component: CodeBot },
];

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [started, setStarted] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [showCreatures, setShowCreatures] = useState(false);
  const { progress, addStars, setGameLevel, resetGameLevel, spendStarsForCreature } = useProgress();

  useEffect(() => {
    initSpeech();
  }, []);

  const handleStart = () => {
    unlockAudio();
    playTap();
    setStarted(true);
    speak('Pick a game!');
  };

  const handleOpenGame = (game) => {
    unlockAudio();
    playTap();
    setCurrentGame(game);
  };

  const handleGoHome = () => {
    setCurrentGame(null);
    setShowCreatures(false);
  };

  // Splash screen
  if (!started) {
    return (
      <div className="app">
        <div className="home" style={{ justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <Mascot size={140} />
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--yellow), var(--orange), var(--pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            BRAIN GAMES!
          </h1>
          <button className="action-btn bounce" onClick={handleStart} style={{ fontSize: '1.5rem', padding: '18px 50px' }}>
            &#9654; Play
          </button>
        </div>
      </div>
    );
  }

  // Creature garden view
  if (showCreatures) {
    return (
      <div className="app">
        <CreatureGarden
          totalStars={progress.totalStars}
          creatures={progress.creatures}
          onSpendStars={spendStarsForCreature}
          onBack={handleGoHome}
        />
      </div>
    );
  }

  // Active game
  if (currentGame) {
    const { Component, id } = currentGame;
    return (
      <div className="app">
        <Component
          stars={progress.games[id]?.stars || 0}
          currentLevel={progress.games[id]?.currentLevel || 0}
          onAddStars={addStars}
          onSetLevel={(level) => setGameLevel(id, level)}
          onResetLevel={() => resetGameLevel(id)}
          onHome={handleGoHome}
        />
      </div>
    );
  }

  // Home screen
  return (
    <div className="app">
      <div className="home">
        <div className="home-header slide-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Mascot size={50} />
          <h1>BRAIN GAMES!</h1>
        </div>

        <div className="stars-bar slide-up" style={{ animationDelay: '0.1s' }}>
          <span style={{ fontSize: '1.6rem' }}>&#11088;</span>
          <span className="star-count">{progress.totalStars}</span>
        </div>

        {/* Quick action buttons: creatures + voice */}
        <div className="home-actions slide-up" style={{ animationDelay: '0.15s' }}>
          <button className="home-action-btn" onClick={() => { playTap(); setShowCreatures(true); }}>
            <span>🥚</span>
            <span>MY CREATURES</span>
          </button>
          <button className="home-action-btn" onClick={() => { playTap(); setShowVoicePicker(true); }}>
            <span>🔊</span>
            <span>VOICE</span>
          </button>
        </div>

        <div className="game-grid">
          {GAMES.map((game, i) => (
            <button
              key={game.id}
              className="game-card pop-in"
              data-color={game.color}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              onClick={() => handleOpenGame(game)}
            >
              {(progress.games[game.id]?.stars || 0) > 0 && (
                <div className="card-badge">&#11088;</div>
              )}
              <div className="card-icon">{game.icon}</div>
              <div className="card-title">{game.title}</div>
            </button>
          ))}
        </div>
      </div>

      {showVoicePicker && <VoicePicker onClose={() => setShowVoicePicker(false)} />}
    </div>
  );
}
