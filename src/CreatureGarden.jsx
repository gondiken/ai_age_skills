import { useState } from 'react';
import { speak } from './speak';
import { playCelebrate, playTap } from './sounds';
import Confetti from './Confetti';

// Creature sets — each set has 6 creatures to collect
const CREATURE_SETS = [
  {
    id: 'forest',
    name: 'FOREST FRIENDS',
    icon: '🌲',
    creatures: [
      { id: 'fox', name: 'FOX', color: '#FB923C' },
      { id: 'owl', name: 'OWL', color: '#A78BFA' },
      { id: 'deer', name: 'DEER', color: '#FACC15' },
      { id: 'bunny', name: 'BUNNY', color: '#F9A8D4' },
      { id: 'bear', name: 'BEAR', color: '#92400E' },
      { id: 'squirrel', name: 'SQUIRREL', color: '#FB923C' },
    ],
  },
  {
    id: 'ocean',
    name: 'OCEAN PALS',
    icon: '🌊',
    creatures: [
      { id: 'octopus', name: 'OCTOPUS', color: '#C084FC' },
      { id: 'jellyfish', name: 'JELLY', color: '#60A5FA' },
      { id: 'seahorse', name: 'SEAHORSE', color: '#4ADE80' },
      { id: 'whale', name: 'WHALE', color: '#60A5FA' },
      { id: 'crab', name: 'CRAB', color: '#F87171' },
      { id: 'turtle', name: 'TURTLE', color: '#4ADE80' },
    ],
  },
  {
    id: 'space',
    name: 'SPACE CREW',
    icon: '🚀',
    creatures: [
      { id: 'alien', name: 'ALIEN', color: '#4ADE80' },
      { id: 'robot', name: 'ROBOT', color: '#94A3B8' },
      { id: 'starling', name: 'STARBEAM', color: '#FACC15' },
      { id: 'comet', name: 'COMET', color: '#60A5FA' },
      { id: 'moonie', name: 'MOONIE', color: '#E2E8F0' },
      { id: 'rocket', name: 'ZIPPY', color: '#F87171' },
    ],
  },
];

const HATCH_COST = 10;

// Simple cute SVG creatures
function CreatureSVG({ creatureId, color, size = 52 }) {
  const s = size;
  const svgs = {
    fox: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="38" rx="16" ry="14" fill={color} />
        <polygon points="16,28 10,10 22,22" fill={color} />
        <polygon points="44,28 50,10 38,22" fill={color} />
        <circle cx="24" cy="34" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="34" r="2.5" fill="#1E1B4B" />
        <ellipse cx="30" cy="38" rx="3" ry="2" fill="#1E1B4B" />
        <path d="M26 42 Q30 46 34 42" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <ellipse cx="30" cy="39" rx="8" ry="6" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),
    owl: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="35" rx="18" ry="18" fill={color} />
        <circle cx="22" cy="30" r="8" fill="white" />
        <circle cx="38" cy="30" r="8" fill="white" />
        <circle cx="22" cy="30" r="4" fill="#1E1B4B" />
        <circle cx="38" cy="30" r="4" fill="#1E1B4B" />
        <polygon points="30,36 27,40 33,40" fill="#FACC15" />
        <polygon points="14,20 12,10 22,22" fill={color} />
        <polygon points="46,20 48,10 38,22" fill={color} />
      </svg>
    ),
    deer: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="14" ry="12" fill={color} />
        <ellipse cx="30" cy="28" rx="10" ry="10" fill={color} />
        <circle cx="25" cy="26" r="2" fill="#1E1B4B" />
        <circle cx="35" cy="26" r="2" fill="#1E1B4B" />
        <ellipse cx="30" cy="31" rx="2" ry="1.5" fill="#1E1B4B" />
        <line x1="22" y1="18" x2="16" y2="6" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="6" x2="12" y2="4" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="6" x2="18" y2="2" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="18" x2="44" y2="6" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="6" x2="48" y2="4" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <line x1="44" y1="6" x2="42" y2="2" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    bunny: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="14" ry="14" fill={color} />
        <ellipse cx="22" cy="16" rx="5" ry="14" fill={color} />
        <ellipse cx="38" cy="16" rx="5" ry="14" fill={color} />
        <ellipse cx="22" cy="16" rx="3" ry="10" fill="rgba(255,150,180,0.5)" />
        <ellipse cx="38" cy="16" rx="3" ry="10" fill="rgba(255,150,180,0.5)" />
        <circle cx="24" cy="36" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="36" r="2.5" fill="#1E1B4B" />
        <ellipse cx="30" cy="40" rx="2" ry="1.5" fill="#FF6B9D" />
        <circle cx="21" cy="42" r="4" fill="rgba(255,150,180,0.3)" />
        <circle cx="39" cy="42" r="4" fill="rgba(255,150,180,0.3)" />
      </svg>
    ),
    bear: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="30" cy="35" r="18" fill={color} />
        <circle cx="16" cy="18" r="7" fill={color} />
        <circle cx="44" cy="18" r="7" fill={color} />
        <circle cx="16" cy="18" r="4" fill="rgba(255,255,255,0.2)" />
        <circle cx="44" cy="18" r="4" fill="rgba(255,255,255,0.2)" />
        <circle cx="24" cy="32" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="32" r="2.5" fill="#1E1B4B" />
        <ellipse cx="30" cy="37" rx="3" ry="2.5" fill="#1E1B4B" />
        <ellipse cx="30" cy="38" rx="8" ry="6" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
    squirrel: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="38" rx="14" ry="14" fill={color} />
        <ellipse cx="30" cy="26" rx="10" ry="10" fill={color} />
        <circle cx="25" cy="24" r="2" fill="#1E1B4B" />
        <circle cx="35" cy="24" r="2" fill="#1E1B4B" />
        <ellipse cx="30" cy="28" rx="2" ry="1.5" fill="#1E1B4B" />
        <path d="M44 38 Q52 20 46 8 Q42 14 44 28" fill={color} />
      </svg>
    ),
    octopus: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="24" rx="16" ry="14" fill={color} />
        <circle cx="24" cy="22" r="3" fill="white" />
        <circle cx="36" cy="22" r="3" fill="white" />
        <circle cx="24" cy="22" r="1.5" fill="#1E1B4B" />
        <circle cx="36" cy="22" r="1.5" fill="#1E1B4B" />
        <path d="M26 28 Q30 32 34 28" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        {[0,1,2,3,4,5].map(i => (
          <path key={i} d={`M${18+i*5} 36 Q${16+i*5} 48 ${20+i*5} 52`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        ))}
      </svg>
    ),
    jellyfish: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="22" rx="18" ry="14" fill={color} opacity="0.7" />
        <ellipse cx="30" cy="22" rx="12" ry="8" fill="rgba(255,255,255,0.2)" />
        <circle cx="24" cy="20" r="2" fill="white" />
        <circle cx="36" cy="20" r="2" fill="white" />
        {[16,24,36,44].map(x => (
          <path key={x} d={`M${x} 34 Q${x+(x<30?4:-4)} 46 ${x} 56`} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
        ))}
      </svg>
    ),
    seahorse: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <path d="M30 8 Q40 12 38 24 Q36 34 30 40 Q24 46 28 54" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <circle cx="34" cy="16" r="6" fill={color} />
        <circle cx="36" cy="14" r="2" fill="white" />
        <circle cx="36" cy="14" r="1" fill="#1E1B4B" />
      </svg>
    ),
    whale: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="34" rx="20" ry="14" fill={color} />
        <circle cx="18" cy="30" r="2.5" fill="white" />
        <circle cx="18" cy="30" r="1.2" fill="#1E1B4B" />
        <path d="M46 28 Q54 18 50 30 Q54 42 46 38" fill={color} />
        <path d="M22 40 Q28 44 34 40" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
      </svg>
    ),
    crab: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="16" ry="12" fill={color} />
        <circle cx="24" cy="32" r="2.5" fill="white" />
        <circle cx="36" cy="32" r="2.5" fill="white" />
        <circle cx="24" cy="32" r="1.2" fill="#1E1B4B" />
        <circle cx="36" cy="32" r="1.2" fill="#1E1B4B" />
        <path d="M14 32 Q6 24 10 20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M46 32 Q54 24 50 20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    turtle: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="18" ry="14" fill={color} />
        <ellipse cx="30" cy="36" rx="14" ry="10" fill="rgba(0,0,0,0.15)" />
        <circle cx="22" cy="22" r="6" fill={color} />
        <circle cx="24" cy="20" r="1.5" fill="#1E1B4B" />
        <circle cx="14" cy="44" r="4" fill={color} />
        <circle cx="46" cy="44" r="4" fill={color} />
        <circle cx="14" cy="30" r="4" fill={color} />
        <circle cx="46" cy="30" r="4" fill={color} />
      </svg>
    ),
    alien: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="30" rx="16" ry="20" fill={color} />
        <ellipse cx="20" cy="26" rx="6" ry="4" fill="#1E1B4B" />
        <ellipse cx="40" cy="26" rx="6" ry="4" fill="#1E1B4B" />
        <ellipse cx="20" cy="26" rx="3" ry="2" fill={color} opacity="0.8" />
        <ellipse cx="40" cy="26" rx="3" ry="2" fill={color} opacity="0.8" />
        <ellipse cx="30" cy="38" rx="3" ry="1.5" fill="rgba(0,0,0,0.3)" />
      </svg>
    ),
    robot: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <rect x="16" y="20" width="28" height="28" rx="4" fill={color} />
        <rect x="20" y="24" width="8" height="6" rx="2" fill="#60A5FA" />
        <rect x="32" y="24" width="8" height="6" rx="2" fill="#60A5FA" />
        <rect x="24" y="36" width="12" height="4" rx="2" fill="rgba(0,0,0,0.3)" />
        <rect x="26" y="10" width="8" height="10" rx="4" fill={color} />
        <circle cx="30" cy="8" r="3" fill="#FACC15" />
      </svg>
    ),
    starling: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <polygon points="30,4 36,22 56,22 40,34 46,52 30,42 14,52 20,34 4,22 24,22" fill={color} />
        <circle cx="26" cy="28" r="2" fill="#1E1B4B" />
        <circle cx="34" cy="28" r="2" fill="#1E1B4B" />
        <path d="M27 33 Q30 36 33 33" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
      </svg>
    ),
    comet: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="38" cy="28" r="12" fill={color} />
        <circle cx="34" cy="26" r="2" fill="white" />
        <circle cx="42" cy="26" r="2" fill="white" />
        <path d="M36 32 Q38 35 40 32" fill="none" stroke="white" strokeWidth="1" />
        <path d="M26 28 Q14 30 4 36" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    moonie: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="30" cy="30" r="18" fill={color} />
        <circle cx="22" cy="22" r="12" fill="#1E1B4B" />
        <circle cx="36" cy="28" r="2" fill="rgba(0,0,0,0.15)" />
        <circle cx="28" cy="38" r="3" fill="rgba(0,0,0,0.1)" />
        <circle cx="32" cy="24" r="1.5" fill="white" opacity="0.5" />
      </svg>
    ),
    rocket: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="28" rx="10" ry="18" fill={color} />
        <polygon points="30,6 24,18 36,18" fill={color} />
        <rect x="24" y="22" width="12" height="6" rx="2" fill="rgba(96,165,250,0.6)" />
        <polygon points="20,40 14,52 24,42" fill="#FB923C" />
        <polygon points="40,40 46,52 36,42" fill="#FB923C" />
        <ellipse cx="30" cy="50" rx="6" ry="4" fill="#FACC15" opacity="0.7" />
      </svg>
    ),
  };
  return svgs[creatureId] || (
    <svg viewBox="0 0 60 60" width={s} height={s}>
      <circle cx="30" cy="30" r="20" fill={color} />
      <circle cx="24" cy="26" r="2" fill="#1E1B4B" />
      <circle cx="36" cy="26" r="2" fill="#1E1B4B" />
    </svg>
  );
}

function EggSVG({ progress, color }) {
  const crackLevel = progress >= 0.75 ? 3 : progress >= 0.5 ? 2 : progress >= 0.25 ? 1 : 0;
  return (
    <svg viewBox="0 0 60 70" width={46} height={54}>
      <ellipse cx="30" cy="38" rx="20" ry="26" fill={color} opacity="0.15" />
      <ellipse cx="30" cy="38" rx="20" ry="26" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      {crackLevel >= 1 && <path d="M20 30 L26 36 L22 42" fill="none" stroke={color} strokeWidth="1.5" />}
      {crackLevel >= 2 && <path d="M38 28 L34 34 L40 40" fill="none" stroke={color} strokeWidth="1.5" />}
      {crackLevel >= 3 && <path d="M26 20 L30 26 L28 32" fill="none" stroke={color} strokeWidth="1.5" />}
      <text x="30" y="44" textAnchor="middle" fontSize="18" fill={color} opacity="0.4">?</text>
    </svg>
  );
}

export default function CreatureGarden({ totalStars, creatures = {}, onSpendStars, onBack }) {
  const [activeSet, setActiveSet] = useState(0);
  const [hatching, setHatching] = useState(null);
  const [justHatched, setJustHatched] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentSet = CREATURE_SETS[activeSet % CREATURE_SETS.length];
  const collected = creatures[currentSet.id] || [];
  const allCollected = currentSet.creatures.every(c => collected.includes(c.id));
  const nextCreature = currentSet.creatures.find(c => !collected.includes(c.id));
  const canHatch = totalStars >= HATCH_COST && nextCreature && !hatching;
  const eggProgress = nextCreature ? Math.min(totalStars / HATCH_COST, 1) : 1;

  const handleHatch = () => {
    if (!canHatch) return;
    playTap();
    setHatching(nextCreature.id);
    setTimeout(() => {
      playCelebrate();
      setShowConfetti(true);
      setJustHatched(nextCreature.id);
      onSpendStars(HATCH_COST, currentSet.id, nextCreature.id);
      speak(`You hatched a ${nextCreature.name.toLowerCase()}!`);
      setTimeout(() => {
        setHatching(null);
        setShowConfetti(false);
        setTimeout(() => setJustHatched(null), 2000);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="game-screen">
      <div className="game-topbar">
        <button className="back-btn" onClick={onBack}>&#8592;</button>
        <span style={{ fontSize: '1.4rem' }}>🥚</span>
        <div className="game-title">My Creatures</div>
        <div className="game-stars">&#11088; {totalStars}</div>
      </div>
      <div className="game-body">
        {showConfetti && <Confetti active={true} />}

        <div className="creature-set-tabs">
          {CREATURE_SETS.map((set, i) => {
            const setCollected = (creatures[set.id] || []).length;
            return (
              <button
                key={set.id}
                className={`creature-set-tab ${i === activeSet ? 'active' : ''}`}
                onClick={() => { setActiveSet(i); playTap(); }}
              >
                <span>{set.icon}</span>
                <span className="creature-set-count">{setCollected}/{set.creatures.length}</span>
              </button>
            );
          })}
        </div>

        <div className="creature-set-name">{currentSet.name}</div>

        <div className="creature-grid">
          {currentSet.creatures.map((creature) => {
            const isCollected = collected.includes(creature.id);
            const isHatching = hatching === creature.id;
            const isJustHatched = justHatched === creature.id;

            return (
              <div
                key={creature.id}
                className={`creature-cell ${isCollected ? 'creature-collected' : 'creature-locked'} ${isHatching ? 'creature-hatching' : ''} ${isJustHatched ? 'pop-in' : ''}`}
              >
                {isCollected ? (
                  <>
                    <div className="creature-svg">
                      <CreatureSVG creatureId={creature.id} color={creature.color} size={52} />
                    </div>
                    <span className="creature-name">{creature.name}</span>
                  </>
                ) : (
                  <>
                    <div className={`creature-egg ${isHatching ? 'creature-egg-shake' : ''}`}>
                      <EggSVG
                        progress={creature.id === nextCreature?.id ? eggProgress : 0}
                        color={creature.color}
                      />
                    </div>
                    <span className="creature-name" style={{ opacity: 0.4 }}>???</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {allCollected ? (
          <div className="creature-complete slide-up">
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <span className="creature-complete-text">SET COMPLETE!</span>
          </div>
        ) : (
          <button
            className={`creature-hatch-btn ${canHatch ? 'bounce' : ''}`}
            onClick={handleHatch}
            disabled={!canHatch}
          >
            <span>🥚</span>
            <span>{canHatch ? `HATCH (${HATCH_COST} ⭐)` : `NEED ${Math.max(0, HATCH_COST - totalStars)} MORE ⭐`}</span>
          </button>
        )}
      </div>
    </div>
  );
}
