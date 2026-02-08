import { useState, useEffect } from 'react';
import { speak } from './speak';

const VOICE_PRESETS = [
  { id: 'default', emoji: '🤖', label: 'ROBOT', rate: 0.85, pitch: 1.1 },
  { id: 'slow', emoji: '🐢', label: 'SLOW', rate: 0.65, pitch: 0.9 },
  { id: 'fast', emoji: '🐇', label: 'FAST', rate: 1.1, pitch: 1.2 },
  { id: 'deep', emoji: '🐻', label: 'BEAR', rate: 0.8, pitch: 0.6 },
  { id: 'high', emoji: '🐭', label: 'MOUSE', rate: 0.95, pitch: 1.8 },
];

const STORAGE_KEY = 'brain_games_voice';

export function getVoicePreset() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = VOICE_PRESETS.find(v => v.id === saved);
      if (found) return found;
    }
  } catch { /* ignore */ }
  return VOICE_PRESETS[0];
}

export default function VoicePicker({ onClose }) {
  const [selected, setSelected] = useState(() => getVoicePreset().id);

  const handlePick = (preset) => {
    setSelected(preset.id);
    localStorage.setItem(STORAGE_KEY, preset.id);
    // Update the speak module's settings
    window.__voiceRate = preset.rate;
    window.__voicePitch = preset.pitch;
    speak('Hello! I sound like this!');
  };

  return (
    <div className="voice-picker-overlay" onClick={onClose}>
      <div className="voice-picker" onClick={e => e.stopPropagation()}>
        <div className="voice-picker-title">PICK A VOICE</div>
        <div className="voice-options">
          {VOICE_PRESETS.map(preset => (
            <button
              key={preset.id}
              className={`voice-option ${selected === preset.id ? 'active' : ''}`}
              onClick={() => handlePick(preset)}
            >
              <span className="voice-emoji">{preset.emoji}</span>
              <span className="voice-label">{preset.label}</span>
            </button>
          ))}
        </div>
        <button className="action-btn" onClick={onClose} style={{ marginTop: 16 }}>
          ✓
        </button>
      </div>
    </div>
  );
}
