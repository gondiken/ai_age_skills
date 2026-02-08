import { useState, useEffect } from 'react';
import { speak, setSelectedVoice } from './speak';
import { playTap } from './sounds';

const STORAGE_KEY = 'brain_games_voice_uri';

function friendlyName(voice) {
  let name = voice.name
    .replace(/^(Microsoft|Google|Apple)\s+/i, '')
    .replace(/\s+Online.*$/i, '')
    .replace(/\s+Desktop.*$/i, '')
    .replace(/\s*\(Natural\).*$/i, ' *')
    .replace(/\s*\(.*?\)\s*$/, '')
    .trim();
  return name || voice.name;
}

export default function VoicePicker({ onClose }) {
  const [voices, setVoices] = useState([]);
  const [selected, setSelected] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || ''; }
    catch { return ''; }
  });

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      // Get English voices, fall back to all if none found
      const english = all.filter(v => v.lang.startsWith('en'));
      const list = english.length > 0 ? english : all;
      // Deduplicate by name and sort
      const seen = new Set();
      const unique = [];
      for (const v of list) {
        if (!seen.has(v.name)) {
          seen.add(v.name);
          unique.push(v);
        }
      }
      unique.sort((a, b) => a.name.localeCompare(b.name));
      setVoices(unique);
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, []);

  const handlePick = (voice) => {
    playTap();
    setSelected(voice.voiceURI);
    localStorage.setItem(STORAGE_KEY, voice.voiceURI);
    setSelectedVoice(voice);
    speak('Hello! This is how I sound!');
  };

  return (
    <div className="voice-picker-overlay" onClick={onClose}>
      <div className="voice-picker" onClick={e => e.stopPropagation()}>
        <div className="voice-picker-title">PICK A VOICE</div>
        <div className="voice-list">
          {voices.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 16, fontSize: '0.9rem' }}>
              Loading voices...
            </div>
          )}
          {voices.map((voice) => (
            <button
              key={voice.voiceURI}
              className={`voice-item ${selected === voice.voiceURI ? 'active' : ''}`}
              onClick={() => handlePick(voice)}
            >
              <span className="voice-item-name">{friendlyName(voice)}</span>
              <span className="voice-item-lang">{voice.lang}</span>
            </button>
          ))}
        </div>
        <button className="action-btn" onClick={onClose} style={{ marginTop: 16, width: '100%' }}>
          DONE
        </button>
      </div>
    </div>
  );
}
