import { useState, useEffect, useRef, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap, playCelebrate } from '../sounds';

const LEVELS = [
  // === 4x4 GRIDS (Levels 1-10) ===
  { size: 4, robot: [0, 3], goal: [3, 3], gems: [[1, 3], [2, 3]], rocks: [], hint: 'GO RIGHT TO THE STAR!' },
  { size: 4, robot: [0, 3], goal: [0, 0], gems: [[0, 2], [0, 1]], rocks: [], hint: 'GO UP!' },
  { size: 4, robot: [0, 3], goal: [3, 0], gems: [[1, 3], [3, 1]], rocks: [], hint: 'RIGHT THEN UP!' },
  { size: 4, robot: [0, 0], goal: [3, 3], gems: [[0, 1], [1, 3]], rocks: [], hint: 'DOWN THEN RIGHT!' },
  { size: 4, robot: [0, 3], goal: [3, 0], gems: [[2, 3]], rocks: [[3, 1]], hint: 'WATCH THE ROCK!' },
  { size: 4, robot: [0, 0], goal: [3, 3], gems: [[2, 0]], rocks: [[1, 1]], hint: 'GO AROUND!' },
  { size: 4, robot: [3, 3], goal: [0, 0], gems: [[2, 3], [0, 2]], rocks: [[1, 1], [2, 2]], hint: 'DODGE THE ROCKS!' },
  { size: 4, robot: [0, 3], goal: [3, 0], gems: [[2, 3], [0, 1]], rocks: [[1, 1], [2, 2]], hint: 'FIND THE PATH!' },
  { size: 4, robot: [3, 0], goal: [0, 3], gems: [[3, 1], [1, 3]], rocks: [[2, 1], [1, 2]], hint: 'DOWN AND LEFT!' },
  { size: 4, robot: [0, 3], goal: [3, 0], gems: [[3, 2], [0, 1]], rocks: [[1, 1], [2, 2], [0, 2]], hint: 'NAVIGATE THE MAZE!' },
  // === 5x5 GRIDS (Levels 11-20) ===
  { size: 5, robot: [0, 4], goal: [4, 0], gems: [[2, 4], [4, 2]], rocks: [], hint: 'BIGGER GRID!' },
  { size: 5, robot: [0, 4], goal: [4, 0], gems: [[1, 4], [3, 0]], rocks: [[4, 2]], hint: 'BLOCKED PATH!' },
  { size: 5, robot: [0, 4], goal: [4, 0], gems: [[2, 4], [4, 3]], rocks: [[2, 2], [3, 1]], hint: 'PLAN YOUR ROUTE!' },
  { size: 5, robot: [0, 4], goal: [4, 0], gems: [[1, 4], [4, 3]], rocks: [[2, 1], [2, 2], [2, 3]], hint: 'WALL IN THE WAY!' },
  { size: 5, robot: [4, 4], goal: [0, 0], gems: [[3, 4], [0, 1]], rocks: [[2, 3], [3, 2], [1, 1]], hint: 'GO BACKWARDS!' },
  { size: 5, robot: [0, 0], goal: [4, 4], gems: [[2, 0], [4, 2]], rocks: [[1, 1], [3, 1], [3, 3]], hint: 'ZIG ZAG PATH!' },
  { size: 5, robot: [2, 4], goal: [2, 0], gems: [[1, 3], [3, 1]], rocks: [[2, 1], [2, 2], [2, 3]], hint: 'AROUND THE WALL!' },
  { size: 5, robot: [0, 4], goal: [4, 4], gems: [[2, 3], [4, 2]], rocks: [[1, 4], [2, 4], [3, 4]], hint: 'DETOUR!' },
  { size: 5, robot: [0, 0], goal: [4, 4], gems: [[1, 0], [3, 2], [4, 3]], rocks: [[0, 1], [2, 1], [3, 3]], hint: 'MANY GEMS!' },
  { size: 5, robot: [4, 0], goal: [0, 4], gems: [[3, 0], [0, 3]], rocks: [[3, 1], [2, 2], [1, 3]], hint: 'SPIRAL PATH!' },
  // === 6x6 GRIDS (Levels 21-32) ===
  { size: 6, robot: [0, 5], goal: [5, 0], gems: [[2, 5], [5, 2]], rocks: [[3, 2]], hint: 'BIG GRID!' },
  { size: 6, robot: [0, 0], goal: [5, 5], gems: [[1, 0], [5, 3]], rocks: [[1, 1], [3, 3]], hint: 'EXPLORE!' },
  { size: 6, robot: [0, 5], goal: [5, 0], gems: [[1, 5], [5, 2]], rocks: [[2, 4], [2, 2], [4, 3], [4, 1]], hint: 'LOTS OF ROCKS!' },
  { size: 6, robot: [5, 5], goal: [0, 0], gems: [[4, 5], [0, 1]], rocks: [[3, 4], [3, 3], [1, 2]], hint: 'REVERSE COURSE!' },
  { size: 6, robot: [0, 5], goal: [5, 0], gems: [[0, 3], [2, 5], [5, 3]], rocks: [[1, 4], [2, 3], [3, 2], [4, 3]], hint: 'THREE GEMS!' },
  { size: 6, robot: [0, 0], goal: [5, 5], gems: [[2, 0], [5, 4]], rocks: [[1, 1], [3, 1], [3, 3], [2, 4]], hint: 'CAREFUL PATH!' },
  { size: 6, robot: [2, 5], goal: [3, 0], gems: [[1, 4], [4, 2]], rocks: [[2, 4], [2, 3], [2, 2], [3, 3], [3, 2]], hint: 'WALL IN THE MIDDLE!' },
  { size: 6, robot: [0, 5], goal: [5, 0], gems: [[1, 4], [5, 1]], rocks: [[0, 3], [1, 2], [3, 4], [4, 3], [4, 1]], hint: 'SUPER TRICKY!' },
  { size: 6, robot: [5, 0], goal: [0, 5], gems: [[4, 0], [0, 4]], rocks: [[4, 1], [3, 1], [2, 3], [1, 3], [1, 4]], hint: 'ALMOST THERE!' },
  { size: 6, robot: [0, 5], goal: [5, 0], gems: [[2, 5], [4, 3]], rocks: [[1, 4], [2, 3], [3, 2], [4, 1], [2, 1]], hint: 'DIAGONAL ROCKS!' },
  { size: 6, robot: [0, 0], goal: [5, 5], gems: [[3, 0], [5, 2]], rocks: [[1, 1], [2, 2], [3, 3], [4, 4]], hint: 'DIAGONAL WALL!' },
  { size: 6, robot: [0, 5], goal: [5, 0], gems: [[1, 5], [5, 2], [4, 0]], rocks: [[1, 4], [2, 3], [3, 2], [4, 1], [1, 2], [3, 4]], hint: 'FINAL CHALLENGE!' },
];

const DIRS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const DIR_ARROWS = { up: '⬆', down: '⬇', left: '⬅', right: '➡' };

const CELL_COLORS = [
  'rgba(99, 102, 241, 0.25)',  // indigo
  'rgba(99, 102, 241, 0.15)',  // lighter indigo
];

// Cute robot SVG that looks in a direction
function RobotSVG({ dir }) {
  const eyeOffsetX = dir === 'left' ? -3 : dir === 'right' ? 3 : 0;
  const eyeOffsetY = dir === 'up' ? -2 : dir === 'down' ? 2 : 0;
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      {/* Antenna */}
      <line x1="25" y1="8" x2="25" y2="2" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="2" r="2.5" fill="#FACC15">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Body */}
      <rect x="10" y="14" width="30" height="26" rx="6" fill="#60A5FA" />
      <rect x="14" y="18" width="22" height="12" rx="3" fill="rgba(30,27,75,0.5)" />
      {/* Eyes */}
      <circle cx={20 + eyeOffsetX} cy={24 + eyeOffsetY} r="3.5" fill="white" />
      <circle cx={30 + eyeOffsetX} cy={24 + eyeOffsetY} r="3.5" fill="white" />
      <circle cx={20 + eyeOffsetX} cy={24 + eyeOffsetY} r="1.8" fill="#1E1B4B" />
      <circle cx={30 + eyeOffsetX} cy={24 + eyeOffsetY} r="1.8" fill="#1E1B4B" />
      {/* Mouth */}
      <rect x="19" y="33" width="12" height="3" rx="1.5" fill="rgba(30,27,75,0.4)" />
      {/* Tracks */}
      <rect x="8" y="40" width="12" height="6" rx="3" fill="#3B82F6" />
      <rect x="30" y="40" width="12" height="6" rx="3" fill="#3B82F6" />
    </svg>
  );
}

// Star goal SVG
function StarSVG() {
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%">
      <polygon
        points="20,2 25,14 38,14 27,22 31,35 20,27 9,35 13,22 2,14 15,14"
        fill="#FACC15"
        stroke="#F59E0B"
        strokeWidth="1"
      >
        <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="6s" repeatCount="indefinite" />
      </polygon>
    </svg>
  );
}

// Rock obstacle SVG
function RockSVG() {
  return (
    <svg viewBox="0 0 40 40" width="80%" height="80%">
      <ellipse cx="20" cy="28" rx="16" ry="10" fill="#6B7280" />
      <ellipse cx="20" cy="22" rx="14" ry="12" fill="#9CA3AF" />
      <ellipse cx="16" cy="20" rx="4" ry="3" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

// Gem collectible SVG
function GemSVG() {
  return (
    <svg viewBox="0 0 30 30" width="60%" height="60%">
      <polygon points="15,2 26,12 22,26 8,26 4,12" fill="#C084FC" stroke="#A855F7" strokeWidth="1" />
      <polygon points="15,2 20,12 15,22 10,12" fill="rgba(255,255,255,0.3)" />
      <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
    </svg>
  );
}

/* ---- inline styles ---- */
const STYLES = `
  .codebot-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 440px;
  }

  .codebot-grid {
    display: grid;
    gap: 3px;
    border-radius: 14px;
    overflow: hidden;
    background: rgba(255,255,255,0.05);
    padding: 4px;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
    width: 100%;
    aspect-ratio: 1;
    max-width: 320px;
  }

  .codebot-cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.3s;
  }

  .codebot-cell--visited {
    background: rgba(96, 165, 250, 0.15) !important;
  }

  .codebot-robot-wrap {
    position: absolute;
    inset: 8%;
    transition: none;
    z-index: 10;
  }
  .codebot-robot-wrap--animated {
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .codebot-program {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 42px;
    padding: 6px 12px;
    background: rgba(255,255,255,0.07);
    border-radius: 30px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .codebot-cmd {
    font-size: 1.3rem;
    background: rgba(255,255,255,0.12);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  }
  .codebot-cmd--executing {
    background: rgba(250, 204, 21, 0.3);
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.4);
  }
  .codebot-cmd--done {
    opacity: 0.35;
  }
  .codebot-cmd--fail {
    background: rgba(248, 113, 113, 0.3);
    animation: shake 0.4s ease;
  }

  .codebot-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .codebot-arrows {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 4px;
  }

  .codebot-arrow {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-bg);
    border: 2px solid rgba(255,255,255,0.2);
    color: white;
    transition: all 0.15s;
  }
  .codebot-arrow:hover {
    border-color: rgba(255,255,255,0.5);
    transform: scale(1.08);
  }
  .codebot-arrow:active {
    transform: scale(0.92);
  }
  .codebot-arrow:disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  .codebot-go {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #4ADE80, #22C55E);
    color: #1E1B4B;
    border: 3px solid rgba(255,255,255,0.3);
    box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4);
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .codebot-go:hover { transform: scale(1.08); }
  .codebot-go:disabled {
    opacity: 0.3;
    pointer-events: none;
    box-shadow: none;
  }

  .codebot-undo {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 1.2rem;
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.15);
    color: white;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .codebot-undo:disabled {
    opacity: 0.2;
    pointer-events: none;
  }

  .codebot-clear {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 1.1rem;
    background: rgba(248, 113, 113, 0.15);
    border: 2px solid rgba(248, 113, 113, 0.3);
    color: #F87171;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .codebot-clear:disabled {
    opacity: 0.2;
    pointer-events: none;
  }

  .codebot-hint {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    text-align: center;
    letter-spacing: 1px;
  }

  .codebot-gem-count {
    font-size: 0.9rem;
    font-weight: 700;
    color: #C084FC;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .codebot-level-badge {
    font-size: 0.8rem;
    font-weight: 800;
    color: rgba(255,255,255,0.5);
    letter-spacing: 2px;
  }

  .codebot-shake {
    animation: codebot-bump 0.4s ease;
  }
  @keyframes codebot-bump {
    0%, 100% { transform: translate(0, 0); }
    20% { transform: translate(-6px, 0); }
    40% { transform: translate(6px, 0); }
    60% { transform: translate(-4px, 0); }
    80% { transform: translate(4px, 0); }
  }

  .codebot-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 30px 20px;
    text-align: center;
  }
  .codebot-done-title {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #FACC15, #F59E0B, #EF4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .codebot-done-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    font-weight: 600;
  }
`;

export default function CodeBot({ stars, onAddStars, onHome }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [commands, setCommands] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [execStep, setExecStep] = useState(-1);
  const [robotPos, setRobotPos] = useState([0, 0]);
  const [robotDir, setRobotDir] = useState('right');
  const [visited, setVisited] = useState(new Set());
  const [collectedGems, setCollectedGems] = useState(new Set());
  const [shaking, setShaking] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [failedStep, setFailedStep] = useState(-1);
  const [completedStars, setCompletedStars] = useState(0);
  const execRef = useRef(false);

  const allDone = levelIndex >= LEVELS.length;
  const level = allDone ? null : LEVELS[levelIndex];

  // Reset on level change
  useEffect(() => {
    if (allDone) {
      playCelebrate();
      speak('Amazing! You finished all the levels!');
      return;
    }
    setCommands([]);
    setRobotPos([...level.robot]);
    setRobotDir('right');
    setVisited(new Set([`${level.robot[0]},${level.robot[1]}`]));
    setCollectedGems(new Set());
    setExecuting(false);
    setExecStep(-1);
    setFailedStep(-1);
    execRef.current = false;
    speak(level.hint);
  }, [levelIndex]);

  const addCommand = (dir) => {
    if (executing) return;
    unlockAudio();
    playTap();
    setCommands(c => [...c, dir]);
  };

  const undoCommand = () => {
    if (executing) return;
    playTap();
    setCommands(c => c.slice(0, -1));
  };

  const clearCommands = () => {
    if (executing) return;
    playTap();
    setCommands([]);
  };

  const runProgram = useCallback(() => {
    if (commands.length === 0 || executing) return;
    unlockAudio();
    playTap();
    setExecuting(true);
    setExecStep(-1);
    setFailedStep(-1);
    execRef.current = true;

    // Reset robot to start
    let pos = [...level.robot];
    setRobotPos([...pos]);
    setVisited(new Set([`${pos[0]},${pos[1]}`]));
    setCollectedGems(new Set());

    let step = 0;
    const collected = new Set();
    const vis = new Set([`${pos[0]},${pos[1]}`]);

    const executeStep = () => {
      if (!execRef.current) return;
      if (step >= commands.length) {
        // Reached end of program — did we reach the goal?
        setExecuting(false);
        execRef.current = false;
        if (pos[0] === level.goal[0] && pos[1] === level.goal[1]) {
          const gemBonus = collected.size;
          const earned = 2 + gemBonus;
          onAddStars('codebot', earned);
          setCompletedStars(earned);
          playCelebrate();
          setTimeout(() => setShowComplete(true), 500);
        } else {
          speak('Almost! Try again!');
          playWrong();
        }
        return;
      }

      setExecStep(step);
      const dir = commands[step];
      setRobotDir(dir);
      const [dx, dy] = DIRS[dir];
      const nx = pos[0] + dx;
      const ny = pos[1] + dy;

      // Check bounds
      if (nx < 0 || nx >= level.size || ny < 0 || ny >= level.size) {
        playWrong();
        setShaking(true);
        setFailedStep(step);
        setTimeout(() => {
          setShaking(false);
          setExecuting(false);
          execRef.current = false;
        }, 600);
        speak('Bump! Try again!');
        return;
      }

      // Check rocks
      if (level.rocks.some(r => r[0] === nx && r[1] === ny)) {
        playWrong();
        setShaking(true);
        setFailedStep(step);
        setTimeout(() => {
          setShaking(false);
          setExecuting(false);
          execRef.current = false;
        }, 600);
        speak('Oops! Rock!');
        return;
      }

      // Move robot
      pos = [nx, ny];
      vis.add(`${nx},${ny}`);
      setRobotPos([...pos]);
      setVisited(new Set(vis));
      playTap();

      // Check gem
      const gemKey = `${nx},${ny}`;
      if (level.gems.some(g => g[0] === nx && g[1] === ny) && !collected.has(gemKey)) {
        collected.add(gemKey);
        setCollectedGems(new Set(collected));
        playCorrect();
      }

      step++;
      setTimeout(executeStep, 400);
    };

    setTimeout(executeStep, 300);
  }, [commands, executing, level, onAddStars]);

  // All levels complete
  if (allDone) {
    return (
      <GameShell title="CODE BOT" emoji="🤖" stars={stars} onBack={onHome}>
        <style>{STYLES}</style>
        <div className="codebot-done">
          <div style={{ fontSize: '5rem' }}>🏆</div>
          <div className="codebot-done-title">ALL LEVELS COMPLETE!</div>
          <div className="codebot-done-sub">YOU ARE A CODING MASTER!</div>
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
      <GameShell title="CODE BOT" emoji="🤖" stars={stars} onBack={onHome}>
        <LevelComplete
          starsEarned={completedStars}
          onNext={() => { setShowComplete(false); setLevelIndex(i => i + 1); }}
          onHome={onHome}
        />
      </GameShell>
    );
  }

  const cellSize = level.size;

  return (
    <GameShell title="CODE BOT" emoji="🤖" stars={stars} onBack={onHome} speakText={level.hint}>
      <style>{STYLES}</style>
      <div className="codebot-game">
        <div className="codebot-level-badge">LEVEL {levelIndex + 1} / {LEVELS.length}</div>
        <p className="codebot-hint">{level.hint}</p>

        {/* Gem counter */}
        {level.gems.length > 0 && (
          <div className="codebot-gem-count">
            <span>💎</span> {collectedGems.size} / {level.gems.length}
          </div>
        )}

        {/* Grid */}
        <div
          className={`codebot-grid ${shaking ? 'codebot-shake' : ''}`}
          style={{ gridTemplateColumns: `repeat(${cellSize}, 1fr)` }}
        >
          {Array.from({ length: cellSize * cellSize }).map((_, idx) => {
            const col = idx % cellSize;
            const row = Math.floor(idx / cellSize);
            const isRobot = robotPos[0] === col && robotPos[1] === row;
            const isGoal = level.goal[0] === col && level.goal[1] === row;
            const isRock = level.rocks.some(r => r[0] === col && r[1] === row);
            const isGem = level.gems.some(g => g[0] === col && g[1] === row) && !collectedGems.has(`${col},${row}`);
            const isVisited = visited.has(`${col},${row}`);
            const cellColor = (col + row) % 2 === 0 ? CELL_COLORS[0] : CELL_COLORS[1];

            return (
              <div
                key={idx}
                className={`codebot-cell ${isVisited ? 'codebot-cell--visited' : ''}`}
                style={{ background: isVisited ? undefined : cellColor }}
              >
                {isRock && <RockSVG />}
                {isGem && <GemSVG />}
                {isGoal && !isRobot && <StarSVG />}
                {isRobot && (
                  <div className="codebot-robot-wrap">
                    <RobotSVG dir={robotDir} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Command strip */}
        <div className="codebot-program">
          {commands.length === 0 && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: 1 }}>
              TAP ARROWS TO CODE
            </span>
          )}
          {commands.map((cmd, i) => (
            <div
              key={i}
              className={`codebot-cmd ${i === execStep ? 'codebot-cmd--executing' : ''} ${i < execStep ? 'codebot-cmd--done' : ''} ${i === failedStep ? 'codebot-cmd--fail' : ''}`}
            >
              {DIR_ARROWS[cmd]}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="codebot-controls">
          <button className="codebot-undo" onClick={undoCommand} disabled={executing || commands.length === 0} title="Undo">
            ↩
          </button>

          <div className="codebot-arrows">
            <div /> {/* empty top-left */}
            <button className="codebot-arrow" onClick={() => addCommand('up')} disabled={executing}>⬆</button>
            <div /> {/* empty top-right */}
            <button className="codebot-arrow" onClick={() => addCommand('left')} disabled={executing}>⬅</button>
            <button className="codebot-arrow" onClick={() => addCommand('down')} disabled={executing}>⬇</button>
            <button className="codebot-arrow" onClick={() => addCommand('right')} disabled={executing}>➡</button>
          </div>

          <button className="codebot-go" onClick={runProgram} disabled={executing || commands.length === 0}>
            GO
          </button>

          <button className="codebot-clear" onClick={clearCommands} disabled={executing || commands.length === 0} title="Clear">
            ✕
          </button>
        </div>
      </div>
    </GameShell>
  );
}
