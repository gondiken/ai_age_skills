// Text-to-speech helper — voice loading + user-gesture unlock + configurable voice

let cachedVoice = null;
let userHasInteracted = false;

function loadVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  cachedVoice =
    voices.find(v => v.lang.startsWith('en') && /female/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith('en-US')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0];
  return cachedVoice;
}

export function initSpeech() {
  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => loadVoice();
  }
  if (window.speechSynthesis.getVoices().length > 0) loadVoice();

  // Load saved voice preset
  try {
    const saved = localStorage.getItem('brain_games_voice');
    const presets = {
      default: { rate: 0.85, pitch: 1.1 },
      slow: { rate: 0.65, pitch: 0.9 },
      fast: { rate: 1.1, pitch: 1.2 },
      deep: { rate: 0.8, pitch: 0.6 },
      high: { rate: 0.95, pitch: 1.8 },
    };
    const p = presets[saved] || presets.default;
    window.__voiceRate = p.rate;
    window.__voicePitch = p.pitch;
  } catch { /* ignore */ }
}

export function unlockAudio() {
  if (userHasInteracted) return;
  userHasInteracted = true;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0.01;
    window.speechSynthesis.speak(u);
  }
}

export function speak(text) {
  if (!text) return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = window.__voiceRate || 0.85;
    utterance.pitch = window.__voicePitch || 1.1;
    utterance.volume = 1;

    const voice = loadVoice();
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);

    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAlive);
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
    utterance.onend = () => clearInterval(keepAlive);
    utterance.onerror = () => clearInterval(keepAlive);
  }, 50);
}
