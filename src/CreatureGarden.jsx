import { useState } from 'react';
import { speak } from './speak';
import { playCelebrate, playTap } from './sounds';
import Confetti from './Confetti';

// Creature sets — each set has 8 creatures to collect
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
      { id: 'hedgehog', name: 'HEDGIE', color: '#D4A574' },
      { id: 'raccoon', name: 'BANDIT', color: '#94A3B8' },
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
      { id: 'dolphin', name: 'FLIPPER', color: '#60A5FA' },
      { id: 'starfish', name: 'TWINKLE', color: '#FACC15' },
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
      { id: 'ufo', name: 'ZOOMER', color: '#4ADE80' },
      { id: 'planet', name: 'RINGY', color: '#FB923C' },
    ],
  },
  {
    id: 'bugs',
    name: 'BUG BUDDIES',
    icon: '🐛',
    creatures: [
      { id: 'ladybug', name: 'LADYBUG', color: '#F87171' },
      { id: 'bee', name: 'BUMBLE', color: '#FACC15' },
      { id: 'butterfly', name: 'FLUTTER', color: '#F9A8D4' },
      { id: 'caterpillar', name: 'WIGGLES', color: '#4ADE80' },
      { id: 'dragonfly', name: 'ZIPWING', color: '#60A5FA' },
      { id: 'ant', name: 'TINY', color: '#C084FC' },
      { id: 'snail', name: 'SHELLY', color: '#FB923C' },
      { id: 'firefly', name: 'SPARKY', color: '#FACC15' },
    ],
  },
  {
    id: 'dinos',
    name: 'DINO SQUAD',
    icon: '🦕',
    creatures: [
      { id: 'trex', name: 'REXY', color: '#4ADE80' },
      { id: 'trike', name: 'SPIKE', color: '#60A5FA' },
      { id: 'stego', name: 'STEGO', color: '#FB923C' },
      { id: 'bronto', name: 'LONGNECK', color: '#A78BFA' },
      { id: 'ptera', name: 'FLAPPY', color: '#FACC15' },
      { id: 'raptor', name: 'DASH', color: '#F87171' },
      { id: 'ankylo', name: 'TANK', color: '#94A3B8' },
      { id: 'spino', name: 'FINBACK', color: '#C084FC' },
    ],
  },
  {
    id: 'farm',
    name: 'FARM FRIENDS',
    icon: '🐄',
    creatures: [
      { id: 'cow', name: 'DAISY', color: '#E2E8F0' },
      { id: 'pig', name: 'OINK', color: '#F9A8D4' },
      { id: 'chicken', name: 'CLUCKY', color: '#FACC15' },
      { id: 'horse', name: 'GALLOP', color: '#92400E' },
      { id: 'sheep', name: 'WOOLLY', color: '#E2E8F0' },
      { id: 'duck', name: 'QUACK', color: '#FACC15' },
      { id: 'goat', name: 'BILLY', color: '#E2E8F0' },
      { id: 'rooster', name: 'STRUT', color: '#F87171' },
    ],
  },
  {
    id: 'mythical',
    name: 'MYTHICAL BEASTS',
    icon: '🐉',
    creatures: [
      { id: 'dragon', name: 'BLAZE', color: '#F87171' },
      { id: 'phoenix', name: 'EMBER', color: '#FB923C' },
      { id: 'griffin', name: 'TALON', color: '#FACC15' },
      { id: 'pegasus', name: 'WINGS', color: '#60A5FA' },
      { id: 'yeti', name: 'FROST', color: '#E2E8F0' },
      { id: 'kraken', name: 'INKY', color: '#C084FC' },
      { id: 'unicorn', name: 'SPARKLE', color: '#F9A8D4' },
      { id: 'fairy', name: 'TINK', color: '#A78BFA' },
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
    /* ─── BUG BUDDIES ─── */
    ladybug: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="18" ry="16" fill={color} />
        <line x1="30" y1="20" x2="30" y2="52" stroke="#1E1B4B" strokeWidth="1.5" />
        <circle cx="22" cy="32" r="3" fill="#1E1B4B" />
        <circle cx="38" cy="32" r="3" fill="#1E1B4B" />
        <circle cx="24" cy="44" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="44" r="2.5" fill="#1E1B4B" />
        <circle cx="30" cy="20" r="8" fill="#1E1B4B" />
        <circle cx="26" cy="18" r="2" fill="white" />
        <circle cx="34" cy="18" r="2" fill="white" />
        <line x1="26" y1="12" x2="22" y2="6" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="12" x2="38" y2="6" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="5" r="2" fill="#1E1B4B" />
        <circle cx="38" cy="5" r="2" fill="#1E1B4B" />
      </svg>
    ),
    bee: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="16" ry="14" fill={color} />
        <rect x="14" y="30" width="32" height="4" rx="1" fill="#1E1B4B" opacity="0.6" />
        <rect x="14" y="38" width="32" height="4" rx="1" fill="#1E1B4B" opacity="0.6" />
        <ellipse cx="20" cy="24" rx="8" ry="10" fill="rgba(255,255,255,0.5)" transform="rotate(-20 20 24)" />
        <ellipse cx="40" cy="24" rx="8" ry="10" fill="rgba(255,255,255,0.5)" transform="rotate(20 40 24)" />
        <circle cx="24" cy="32" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="32" r="2.5" fill="#1E1B4B" />
        <path d="M27 38 Q30 41 33 38" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <line x1="26" y1="22" x2="22" y2="14" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="22" x2="38" y2="14" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    butterfly: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="14" cy="22" rx="10" ry="12" fill={color} opacity="0.8" />
        <ellipse cx="46" cy="22" rx="10" ry="12" fill={color} opacity="0.8" />
        <ellipse cx="18" cy="42" rx="8" ry="10" fill={color} opacity="0.6" />
        <ellipse cx="42" cy="42" rx="8" ry="10" fill={color} opacity="0.6" />
        <ellipse cx="14" cy="22" rx="5" ry="6" fill="rgba(255,255,255,0.3)" />
        <ellipse cx="46" cy="22" rx="5" ry="6" fill="rgba(255,255,255,0.3)" />
        <rect x="28" y="14" width="4" height="32" rx="2" fill="#1E1B4B" />
        <circle cx="30" cy="14" r="4" fill="#1E1B4B" />
        <circle cx="28" cy="12" r="1.5" fill="white" />
        <circle cx="32" cy="12" r="1.5" fill="white" />
        <line x1="28" y1="10" x2="22" y2="4" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="10" x2="38" y2="4" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="3" r="1.5" fill={color} />
        <circle cx="38" cy="3" r="1.5" fill={color} />
      </svg>
    ),
    caterpillar: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="10" cy="40" r="7" fill={color} opacity="0.7" />
        <circle cx="22" cy="36" r="7" fill={color} opacity="0.8" />
        <circle cx="34" cy="38" r="7" fill={color} opacity="0.7" />
        <circle cx="46" cy="34" r="7" fill={color} opacity="0.8" />
        <circle cx="52" cy="24" r="8" fill={color} />
        <circle cx="49" cy="22" r="2" fill="white" />
        <circle cx="55" cy="22" r="2" fill="white" />
        <circle cx="49" cy="22" r="1" fill="#1E1B4B" />
        <circle cx="55" cy="22" r="1" fill="#1E1B4B" />
        <path d="M50 28 Q52 30 54 28" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <line x1="49" y1="16" x2="46" y2="8" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="55" y1="16" x2="58" y2="8" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="46" cy="7" r="2" fill={color} />
        <circle cx="58" cy="7" r="2" fill={color} />
      </svg>
    ),
    dragonfly: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="20" rx="8" ry="6" fill={color} />
        <circle cx="27" cy="18" r="3" fill="white" />
        <circle cx="33" cy="18" r="3" fill="white" />
        <circle cx="27" cy="18" r="1.5" fill="#1E1B4B" />
        <circle cx="33" cy="18" r="1.5" fill="#1E1B4B" />
        <rect x="28" y="26" width="4" height="26" rx="2" fill={color} />
        <ellipse cx="16" cy="28" rx="12" ry="5" fill={color} opacity="0.4" />
        <ellipse cx="44" cy="28" rx="12" ry="5" fill={color} opacity="0.4" />
        <ellipse cx="18" cy="36" rx="10" ry="4" fill={color} opacity="0.3" />
        <ellipse cx="42" cy="36" rx="10" ry="4" fill={color} opacity="0.3" />
      </svg>
    ),
    ant: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="30" cy="16" r="8" fill={color} />
        <circle cx="27" cy="14" r="2" fill="white" />
        <circle cx="33" cy="14" r="2" fill="white" />
        <circle cx="27" cy="14" r="1" fill="#1E1B4B" />
        <circle cx="33" cy="14" r="1" fill="#1E1B4B" />
        <line x1="26" y1="9" x2="20" y2="3" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="9" x2="40" y2="3" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="30" cy="30" rx="7" ry="6" fill={color} />
        <ellipse cx="30" cy="46" rx="10" ry="8" fill={color} />
        <line x1="24" y1="28" x2="14" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="28" x2="46" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="32" x2="14" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="32" x2="46" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="44" x2="14" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="44" x2="46" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    /* ─── DINO SQUAD ─── */
    trex: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="38" rx="16" ry="14" fill={color} />
        <ellipse cx="32" cy="22" rx="14" ry="12" fill={color} />
        <circle cx="36" cy="18" r="3" fill="white" />
        <circle cx="36" cy="18" r="1.5" fill="#1E1B4B" />
        <path d="M22 26 L22 30 L26 30" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M38 26 Q44 28 42 32" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M24 28 L46 28" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <path d="M26 26 L28 30 M30 26 L32 30 M34 26 L36 30 M38 26 L40 30 M42 26 L44 30" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="20" cy="50" r="4" fill={color} />
        <circle cx="36" cy="50" r="4" fill={color} />
        <path d="M42 38 Q50 36 52 42 Q48 40 44 42" fill={color} />
      </svg>
    ),
    trike: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="40" rx="18" ry="14" fill={color} />
        <ellipse cx="38" cy="26" rx="14" ry="12" fill={color} />
        <path d="M44 14 Q56 10 54 22 Q48 18 44 20" fill={color} opacity="0.6" />
        <circle cx="40" cy="24" r="3" fill="white" />
        <circle cx="40" cy="24" r="1.5" fill="#1E1B4B" />
        <line x1="48" y1="22" x2="56" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="42" y1="16" x2="46" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="16" x2="34" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 30 Q38 34 42 30" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <circle cx="18" cy="52" r="4" fill={color} />
        <circle cx="38" cy="52" r="4" fill={color} />
      </svg>
    ),
    stego: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="38" rx="20" ry="12" fill={color} />
        <ellipse cx="46" cy="32" rx="8" ry="7" fill={color} />
        <circle cx="48" cy="30" r="2" fill="white" />
        <circle cx="48" cy="30" r="1" fill="#1E1B4B" />
        <path d="M50 34 Q52 36 54 34" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <polygon points="14,28 18,16 22,28" fill={color} opacity="0.7" />
        <polygon points="20,26 24,12 28,26" fill={color} opacity="0.8" />
        <polygon points="26,26 30,14 34,26" fill={color} opacity="0.7" />
        <polygon points="32,26 36,16 40,28" fill={color} opacity="0.8" />
        <path d="M8 38 Q4 34 2 40 Q4 38 6 40" fill={color} />
        <path d="M6 40 Q2 38 0 44" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="48" r="3.5" fill={color} />
        <circle cx="36" cy="48" r="3.5" fill={color} />
      </svg>
    ),
    bronto: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="18" ry="12" fill={color} />
        <path d="M44 36 Q52 30 54 40 Q50 38 48 40" fill={color} />
        <path d="M16 36 Q12 28 8 20 Q6 16 10 14" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="12" r="6" fill={color} />
        <circle cx="12" cy="10" r="2" fill="white" />
        <circle cx="12" cy="10" r="1" fill="#1E1B4B" />
        <path d="M7 16 Q10 18 13 16" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <circle cx="20" cy="50" r="4" fill={color} />
        <circle cx="40" cy="50" r="4" fill={color} />
      </svg>
    ),
    ptera: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <polygon points="2,24 20,30 14,18" fill={color} opacity="0.7" />
        <polygon points="58,24 40,30 46,18" fill={color} opacity="0.7" />
        <polygon points="6,28 22,34 16,22" fill={color} opacity="0.5" />
        <polygon points="54,28 38,34 44,22" fill={color} opacity="0.5" />
        <ellipse cx="30" cy="32" rx="10" ry="8" fill={color} />
        <ellipse cx="30" cy="24" rx="7" ry="6" fill={color} />
        <circle cx="27" cy="22" r="2.5" fill="white" />
        <circle cx="33" cy="22" r="2.5" fill="white" />
        <circle cx="27" cy="22" r="1.2" fill="#1E1B4B" />
        <circle cx="33" cy="22" r="1.2" fill="#1E1B4B" />
        <polygon points="30,26 27,32 33,32" fill="#FB923C" />
      </svg>
    ),
    raptor: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="12" ry="10" fill={color} />
        <ellipse cx="36" cy="22" rx="10" ry="10" fill={color} />
        <circle cx="40" cy="19" r="3" fill="white" />
        <circle cx="40" cy="19" r="1.5" fill="#1E1B4B" />
        <path d="M32 26 L46 26" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <path d="M34 24 L36 28 M38 24 L40 28 M42 24 L44 28" fill="none" stroke="white" strokeWidth="1" />
        <path d="M26 26 Q22 28 22 32" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 36 Q10 34 8 40 Q12 38 14 40" fill={color} />
        <circle cx="24" cy="44" r="3.5" fill={color} />
        <circle cx="36" cy="44" r="3.5" fill={color} />
        <path d="M24 44 L22 50 L26 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M36 44 L34 50 L38 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    /* ─── FARM FRIENDS ─── */
    cow: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="38" rx="18" ry="14" fill={color} />
        <ellipse cx="30" cy="24" rx="12" ry="10" fill={color} />
        <circle cx="24" cy="22" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="22" r="2.5" fill="#1E1B4B" />
        <ellipse cx="30" cy="28" rx="6" ry="4" fill="#F9A8D4" />
        <circle cx="28" cy="27" r="1" fill="#1E1B4B" />
        <circle cx="32" cy="27" r="1" fill="#1E1B4B" />
        <path d="M14 20 Q8 12 12 8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M46 20 Q52 12 48 8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="22" cy="34" r="5" fill="rgba(0,0,0,0.15)" />
        <circle cx="36" cy="40" r="4" fill="rgba(0,0,0,0.15)" />
      </svg>
    ),
    pig: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="18" ry="16" fill={color} />
        <circle cx="22" cy="30" r="2.5" fill="#1E1B4B" />
        <circle cx="38" cy="30" r="2.5" fill="#1E1B4B" />
        <ellipse cx="30" cy="38" rx="8" ry="6" fill="rgba(255,150,180,0.5)" />
        <circle cx="27" cy="38" r="2" fill="#1E1B4B" />
        <circle cx="33" cy="38" r="2" fill="#1E1B4B" />
        <polygon points="18,24 14,14 22,20" fill={color} />
        <polygon points="42,24 46,14 38,20" fill={color} />
        <path d="M44 44 Q50 42 48 48 Q46 46 44 48" fill={color} />
      </svg>
    ),
    chicken: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="16" ry="14" fill={color} />
        <ellipse cx="30" cy="24" rx="10" ry="10" fill={color} />
        <circle cx="26" cy="22" r="2" fill="#1E1B4B" />
        <circle cx="34" cy="22" r="2" fill="#1E1B4B" />
        <polygon points="30,26 26,32 34,32" fill="#FB923C" />
        <path d="M28 14 Q30 6 32 14" fill="#F87171" />
        <path d="M26 14 Q28 8 30 14" fill="#F87171" opacity="0.7" />
        <path d="M30 14 Q32 8 34 14" fill="#F87171" opacity="0.7" />
        <polygon points="14,44 8,50 16,48" fill={color} />
        <polygon points="46,44 52,50 44,48" fill={color} />
      </svg>
    ),
    horse: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="40" rx="16" ry="12" fill={color} />
        <path d="M38 36 Q44 28 42 18" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
        <circle cx="42" cy="16" r="8" fill={color} />
        <circle cx="44" cy="14" r="2" fill="#1E1B4B" />
        <path d="M48 18 Q52 20 50 16" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <path d="M38 8 Q36 2 34 8 Q36 4 38 8" fill="rgba(0,0,0,0.3)" />
        <path d="M42 8 Q40 2 38 8" fill="rgba(0,0,0,0.3)" />
        <circle cx="20" cy="50" r="3" fill={color} />
        <circle cx="36" cy="50" r="3" fill={color} />
        <path d="M12 40 Q6 38 4 44 Q8 42 10 44" fill={color} />
      </svg>
    ),
    sheep: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="18" cy="32" r="8" fill={color} />
        <circle cx="30" cy="28" r="9" fill={color} />
        <circle cx="42" cy="32" r="8" fill={color} />
        <circle cx="22" cy="40" r="8" fill={color} />
        <circle cx="38" cy="40" r="8" fill={color} />
        <circle cx="30" cy="44" r="7" fill={color} />
        <circle cx="30" cy="20" r="8" fill="#F9A8D4" opacity="0.6" />
        <circle cx="26" cy="18" r="2" fill="#1E1B4B" />
        <circle cx="34" cy="18" r="2" fill="#1E1B4B" />
        <ellipse cx="30" cy="22" rx="2" ry="1.5" fill="#1E1B4B" />
        <circle cx="18" cy="52" r="2.5" fill="#1E1B4B" />
        <circle cx="42" cy="52" r="2.5" fill="#1E1B4B" />
      </svg>
    ),
    duck: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="18" ry="12" fill={color} />
        <circle cx="34" cy="24" r="10" fill={color} />
        <circle cx="38" cy="22" r="2.5" fill="#1E1B4B" />
        <path d="M40 26 Q46 28 44 24 Q48 28 42 30" fill="#FB923C" />
        <path d="M14 38 Q8 34 10 42 Q12 40 14 42" fill={color} opacity="0.7" />
        <ellipse cx="30" cy="42" rx="12" ry="6" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
    /* ─── MYTHICAL BEASTS ─── */
    dragon: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="38" rx="16" ry="12" fill={color} />
        <ellipse cx="34" cy="24" rx="12" ry="10" fill={color} />
        <circle cx="38" cy="20" r="3" fill="#FACC15" />
        <circle cx="38" cy="20" r="1.5" fill="#1E1B4B" />
        <path d="M28 28 L42 28" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <path d="M30 26 L32 30 M34 26 L36 30 M38 26 L40 30" fill="none" stroke="white" strokeWidth="1" />
        <polygon points="28,16 22,6 32,14" fill={color} opacity="0.8" />
        <polygon points="36,14 40,4 42,16" fill={color} opacity="0.8" />
        <path d="M42 36 Q50 34 54 38 Q50 36 48 40" fill={color} />
        <polygon points="18,32 8,28 12,36" fill={color} opacity="0.5" />
        <polygon points="16,36 6,34 10,40" fill={color} opacity="0.5" />
        <ellipse cx="26" cy="48" rx="3" ry="2" fill="#FACC15" opacity="0.5" />
        <ellipse cx="34" cy="50" rx="2" ry="1.5" fill="#FACC15" opacity="0.4" />
      </svg>
    ),
    phoenix: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="14" ry="12" fill={color} />
        <ellipse cx="30" cy="24" rx="10" ry="8" fill={color} />
        <circle cx="26" cy="22" r="2.5" fill="#FACC15" />
        <circle cx="34" cy="22" r="2.5" fill="#FACC15" />
        <circle cx="26" cy="22" r="1.2" fill="#1E1B4B" />
        <circle cx="34" cy="22" r="1.2" fill="#1E1B4B" />
        <polygon points="30,26 27,30 33,30" fill="#F87171" />
        <polygon points="24,16 20,4 28,14" fill="#FACC15" opacity="0.8" />
        <polygon points="30,16 28,2 32,16" fill="#F87171" opacity="0.7" />
        <polygon points="36,16 40,4 32,14" fill="#FACC15" opacity="0.8" />
        <polygon points="16,34 4,26 10,38" fill={color} opacity="0.6" />
        <polygon points="44,34 56,26 50,38" fill={color} opacity="0.6" />
        <polygon points="14,38 2,34 8,42" fill="#FACC15" opacity="0.4" />
        <polygon points="46,38 58,34 52,42" fill="#FACC15" opacity="0.4" />
        <path d="M24 48 Q20 56 26 52" fill={color} opacity="0.5" />
        <path d="M36 48 Q40 56 34 52" fill={color} opacity="0.5" />
      </svg>
    ),
    griffin: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="40" rx="16" ry="12" fill={color} />
        <ellipse cx="34" cy="26" rx="12" ry="10" fill={color} />
        <circle cx="38" cy="22" r="2.5" fill="#1E1B4B" />
        <polygon points="40,28 48,30 44,26" fill="#FB923C" />
        <polygon points="30,16 26,8 34,16" fill={color} opacity="0.7" />
        <polygon points="36,16 34,6 40,16" fill={color} opacity="0.7" />
        <polygon points="14,34 2,24 10,38" fill={color} opacity="0.5" />
        <polygon points="12,38 0,32 8,42" fill={color} opacity="0.4" />
        <circle cx="20" cy="50" r="3.5" fill={color} />
        <circle cx="36" cy="50" r="3.5" fill={color} />
        <path d="M42 40 Q50 38 54 42 Q50 40 48 44" fill={color} />
      </svg>
    ),
    pegasus: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="40" rx="14" ry="10" fill={color} />
        <path d="M38 36 Q42 28 40 20" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="18" r="7" fill={color} />
        <circle cx="42" cy="16" r="2" fill="#1E1B4B" />
        <path d="M46 20 Q48 22 46 18" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <polygon points="14,30 2,18 10,32" fill="white" opacity="0.6" />
        <polygon points="12,34 0,24 8,36" fill="white" opacity="0.5" />
        <polygon points="16,28 6,14 12,30" fill="white" opacity="0.4" />
        <path d="M38 10 Q36 4 34 10 Q36 6 38 10" fill={color} opacity="0.6" />
        <circle cx="20" cy="48" r="3" fill={color} />
        <circle cx="36" cy="48" r="3" fill={color} />
        <path d="M14 40 Q8 38 6 44 Q10 42 12 44" fill={color} />
      </svg>
    ),
    yeti: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="36" rx="20" ry="18" fill={color} />
        <circle cx="22" cy="28" r="5" fill="white" />
        <circle cx="38" cy="28" r="5" fill="white" />
        <circle cx="22" cy="28" r="2.5" fill="#60A5FA" />
        <circle cx="38" cy="28" r="2.5" fill="#60A5FA" />
        <circle cx="22" cy="28" r="1.2" fill="#1E1B4B" />
        <circle cx="38" cy="28" r="1.2" fill="#1E1B4B" />
        <ellipse cx="30" cy="38" rx="4" ry="2.5" fill="rgba(0,0,0,0.2)" />
        <path d="M28 42 Q30 44 32 42" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <path d="M12 24 Q8 16 14 18" fill={color} />
        <path d="M48 24 Q52 16 46 18" fill={color} />
        <circle cx="16" cy="46" r="5" fill={color} />
        <circle cx="44" cy="46" r="5" fill={color} />
      </svg>
    ),
    kraken: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="20" rx="16" ry="14" fill={color} />
        <circle cx="24" cy="16" r="4" fill="white" />
        <circle cx="36" cy="16" r="4" fill="white" />
        <circle cx="24" cy="16" r="2" fill="#1E1B4B" />
        <circle cx="36" cy="16" r="2" fill="#1E1B4B" />
        <path d="M27 24 Q30 28 33 24" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        {[0,1,2,3,4,5,6,7].map(i => (
          <path key={i} d={`M${12+i*5} 32 Q${10+i*5} 44 ${14+i*5} 54`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        ))}
      </svg>
    ),
    /* ─── EXTRA FOREST ─── */
    hedgehog: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="20" ry="14" fill={color} />
        {[0,1,2,3,4,5,6].map(i => (
          <line key={i} x1={14+i*5} y1="38" x2={12+i*5} y2={22+Math.abs(i-3)*2} stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        <ellipse cx="38" cy="38" rx="8" ry="8" fill={color} />
        <circle cx="40" cy="36" r="2" fill="#1E1B4B" />
        <circle cx="44" cy="38" r="1.5" fill="#1E1B4B" />
        <path d="M42 40 Q44 42 42 42" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <circle cx="22" cy="50" r="3" fill={color} />
        <circle cx="38" cy="50" r="3" fill={color} />
      </svg>
    ),
    raccoon: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="38" rx="16" ry="14" fill={color} />
        <ellipse cx="30" cy="24" rx="12" ry="10" fill={color} />
        <ellipse cx="22" cy="22" rx="6" ry="4" fill="#1E1B4B" />
        <ellipse cx="38" cy="22" rx="6" ry="4" fill="#1E1B4B" />
        <circle cx="22" cy="22" r="2.5" fill="white" />
        <circle cx="38" cy="22" r="2.5" fill="white" />
        <circle cx="22" cy="22" r="1.2" fill="#1E1B4B" />
        <circle cx="38" cy="22" r="1.2" fill="#1E1B4B" />
        <ellipse cx="30" cy="28" rx="3" ry="2" fill="#1E1B4B" />
        <polygon points="20,16 16,6 24,14" fill={color} />
        <polygon points="40,16 44,6 36,14" fill={color} />
        <path d="M44 38 Q52 36 50 42 Q48 38 46 42 Q44 38 42 42" fill={color} />
      </svg>
    ),
    /* ─── EXTRA OCEAN ─── */
    dolphin: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="32" rx="20" ry="10" fill={color} />
        <path d="M48 28 Q56 22 52 32 Q54 28 50 30" fill={color} />
        <path d="M12 32 Q6 26 10 22" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M28 22 Q30 14 32 22" fill={color} opacity="0.7" />
        <circle cx="44" cy="30" r="2" fill="white" />
        <circle cx="44" cy="30" r="1" fill="#1E1B4B" />
        <path d="M48 34 Q50 36 48 36" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <ellipse cx="30" cy="34" rx="14" ry="4" fill="rgba(255,255,255,0.25)" />
      </svg>
    ),
    starfish: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <polygon points="30,6 35,22 54,22 39,32 44,50 30,40 16,50 21,32 6,22 25,22" fill={color} />
        <polygon points="30,14 33,24 44,24 35,30 38,42 30,36 22,42 25,30 16,24 27,24" fill={color} opacity="0.6" />
        <circle cx="26" cy="26" r="2" fill="#1E1B4B" />
        <circle cx="34" cy="26" r="2" fill="#1E1B4B" />
        <path d="M28 30 Q30 33 32 30" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
      </svg>
    ),
    /* ─── EXTRA SPACE ─── */
    ufo: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="34" rx="24" ry="8" fill={color} opacity="0.5" />
        <ellipse cx="30" cy="26" rx="14" ry="10" fill={color} />
        <ellipse cx="30" cy="34" rx="20" ry="5" fill={color} />
        <circle cx="24" cy="24" r="2.5" fill="white" />
        <circle cx="36" cy="24" r="2.5" fill="white" />
        <circle cx="24" cy="24" r="1.2" fill="#1E1B4B" />
        <circle cx="36" cy="24" r="1.2" fill="#1E1B4B" />
        <circle cx="16" cy="36" r="2" fill="#FACC15" opacity="0.7" />
        <circle cx="30" cy="38" r="2" fill="#FACC15" opacity="0.7" />
        <circle cx="44" cy="36" r="2" fill="#FACC15" opacity="0.7" />
        <path d="M26 46 L22 54" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <path d="M30 46 L30 56" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <path d="M34 46 L38 54" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    planet: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="30" cy="30" r="16" fill={color} />
        <ellipse cx="30" cy="30" rx="28" ry="6" fill="none" stroke={color} strokeWidth="3" opacity="0.4" transform="rotate(-20 30 30)" />
        <circle cx="24" cy="26" r="2.5" fill="#1E1B4B" />
        <circle cx="36" cy="26" r="2.5" fill="#1E1B4B" />
        <path d="M26 34 Q30 38 34 34" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
        <circle cx="22" cy="34" r="3" fill="rgba(255,255,255,0.15)" />
        <circle cx="36" cy="22" r="2" fill="rgba(255,255,255,0.15)" />
      </svg>
    ),
    /* ─── EXTRA BUGS ─── */
    snail: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="26" cy="46" rx="18" ry="8" fill={color} opacity="0.6" />
        <circle cx="34" cy="32" r="14" fill={color} />
        <circle cx="34" cy="32" r="9" fill="rgba(255,255,255,0.2)" />
        <path d="M34 26 Q38 32 34 38" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <ellipse cx="14" cy="38" rx="6" ry="5" fill={color} opacity="0.7" />
        <circle cx="12" cy="36" r="2" fill="#1E1B4B" />
        <circle cx="16" cy="36" r="2" fill="#1E1B4B" />
        <line x1="11" y1="32" x2="8" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="32" x2="20" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="23" r="2" fill={color} />
        <circle cx="20" cy="23" r="2" fill={color} />
      </svg>
    ),
    firefly: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="34" rx="10" ry="12" fill={color} />
        <ellipse cx="30" cy="44" rx="7" ry="6" fill="#FACC15" opacity="0.6" />
        <circle cx="30" cy="44" r="4" fill="#FACC15" opacity="0.4" />
        <circle cx="30" cy="20" r="8" fill={color} />
        <circle cx="27" cy="18" r="2" fill="white" />
        <circle cx="33" cy="18" r="2" fill="white" />
        <circle cx="27" cy="18" r="1" fill="#1E1B4B" />
        <circle cx="33" cy="18" r="1" fill="#1E1B4B" />
        <path d="M28 23 Q30 25 32 23" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <ellipse cx="18" cy="28" rx="8" ry="4" fill="rgba(255,255,255,0.35)" transform="rotate(-30 18 28)" />
        <ellipse cx="42" cy="28" rx="8" ry="4" fill="rgba(255,255,255,0.35)" transform="rotate(30 42 28)" />
        <line x1="27" y1="12" x2="24" y2="6" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="33" y1="12" x2="36" y2="6" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    /* ─── EXTRA DINOS ─── */
    ankylo: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="38" rx="20" ry="12" fill={color} />
        <ellipse cx="28" cy="34" rx="18" ry="6" fill="rgba(255,255,255,0.15)" />
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={12+i*8} cy="28" r="3" fill={color} opacity="0.7" />
        ))}
        <ellipse cx="46" cy="34" rx="7" ry="6" fill={color} />
        <circle cx="48" cy="32" r="2" fill="white" />
        <circle cx="48" cy="32" r="1" fill="#1E1B4B" />
        <path d="M8 38 Q2 36 4 42 Q6 38 8 42" fill={color} />
        <circle cx="4" cy="42" r="2.5" fill={color} />
        <circle cx="18" cy="48" r="3" fill={color} />
        <circle cx="38" cy="48" r="3" fill={color} />
      </svg>
    ),
    spino: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="40" rx="16" ry="10" fill={color} />
        <path d="M36 36 Q42 28 40 18" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="16" r="7" fill={color} />
        <circle cx="42" cy="14" r="2.5" fill="white" />
        <circle cx="42" cy="14" r="1.2" fill="#1E1B4B" />
        <path d="M46 18 L52 18" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 30 Q16 14 20 10" fill="none" stroke={color} strokeWidth="2" opacity="0.7" />
        <path d="M24 30 Q22 16 26 12" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
        <path d="M30 32 Q28 20 32 16" fill="none" stroke={color} strokeWidth="2" opacity="0.7" />
        <circle cx="20" cy="48" r="3" fill={color} />
        <circle cx="36" cy="48" r="3" fill={color} />
        <path d="M12 40 Q6 38 4 44 Q8 42 10 44" fill={color} />
      </svg>
    ),
    /* ─── EXTRA FARM ─── */
    goat: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="40" rx="16" ry="12" fill={color} />
        <ellipse cx="30" cy="26" rx="10" ry="10" fill={color} />
        <circle cx="25" cy="24" r="2" fill="#1E1B4B" />
        <circle cx="35" cy="24" r="2" fill="#1E1B4B" />
        <ellipse cx="30" cy="30" rx="3" ry="2" fill="#F9A8D4" />
        <line x1="22" y1="16" x2="16" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="16" x2="44" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 32 Q30 36 32 32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <circle cx="20" cy="50" r="3" fill={color} />
        <circle cx="36" cy="50" r="3" fill={color} />
      </svg>
    ),
    rooster: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="30" cy="40" rx="16" ry="14" fill={color} />
        <ellipse cx="30" cy="24" rx="10" ry="10" fill={color} />
        <circle cx="26" cy="22" r="2" fill="#1E1B4B" />
        <circle cx="34" cy="22" r="2" fill="#1E1B4B" />
        <polygon points="30,26 26,32 34,32" fill="#FB923C" />
        <path d="M26 14 Q24 4 28 8 Q26 2 30 6 Q28 0 34 8 Q30 4 34 14" fill="#F87171" />
        <path d="M36 28 Q42 30 40 26 Q44 30 38 32" fill="#F87171" opacity="0.8" />
        <polygon points="14,44 6,50 14,48" fill={color} opacity="0.8" />
        <polygon points="46,44 54,50 46,48" fill={color} opacity="0.8" />
        <path d="M42 40 Q50 38 48 46 Q46 42 44 46" fill={color} />
      </svg>
    ),
    /* ─── EXTRA MYTHICAL ─── */
    unicorn: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <ellipse cx="28" cy="42" rx="14" ry="10" fill={color} />
        <path d="M38 38 Q42 30 40 22" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="20" r="7" fill={color} />
        <circle cx="42" cy="18" r="2" fill="#1E1B4B" />
        <path d="M46 22 Q48 24 46 20" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <line x1="38" y1="12" x2="36" y2="2" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36" cy="1" r="1.5" fill="#FACC15" />
        <path d="M38 12 Q34 6 38 4" fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.4" />
        <path d="M36 8 Q32 4 36 2" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.4" />
        <circle cx="20" cy="50" r="3" fill={color} />
        <circle cx="36" cy="50" r="3" fill={color} />
        <path d="M14 42 Q8 40 6 46 Q10 44 12 46" fill={color} />
      </svg>
    ),
    fairy: (
      <svg viewBox="0 0 60 60" width={s} height={s}>
        <circle cx="30" cy="18" r="8" fill={color} />
        <circle cx="27" cy="16" r="2" fill="white" />
        <circle cx="33" cy="16" r="2" fill="white" />
        <circle cx="27" cy="16" r="1" fill="#1E1B4B" />
        <circle cx="33" cy="16" r="1" fill="#1E1B4B" />
        <path d="M28 21 Q30 23 32 21" fill="none" stroke="#1E1B4B" strokeWidth="1" />
        <ellipse cx="30" cy="36" rx="8" ry="12" fill={color} />
        <ellipse cx="16" cy="30" rx="10" ry="6" fill={color} opacity="0.4" transform="rotate(-20 16 30)" />
        <ellipse cx="44" cy="30" rx="10" ry="6" fill={color} opacity="0.4" transform="rotate(20 44 30)" />
        <ellipse cx="18" cy="36" rx="8" ry="5" fill={color} opacity="0.3" transform="rotate(-10 18 36)" />
        <ellipse cx="42" cy="36" rx="8" ry="5" fill={color} opacity="0.3" transform="rotate(10 42 36)" />
        <circle cx="14" cy="26" r="1.5" fill="#FACC15" opacity="0.5" />
        <circle cx="46" cy="26" r="1.5" fill="#FACC15" opacity="0.5" />
        <circle cx="10" cy="34" r="1" fill="#FACC15" opacity="0.4" />
        <circle cx="50" cy="34" r="1" fill="#FACC15" opacity="0.4" />
        <line x1="30" y1="10" x2="30" y2="4" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="30" cy="3" r="2" fill="#FACC15" opacity="0.7" />
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
