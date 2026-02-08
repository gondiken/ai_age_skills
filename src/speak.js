// Text-to-speech helper — voice loading + user-gesture unlock + voice selection

let selectedVoice = null;
let userHasInteracted = false;

function loadVoices() {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  // Try to restore saved voice
  try {
    const savedURI = localStorage.getItem('brain_games_voice_uri');
    if (savedURI) {
      const found = voices.find(v => v.voiceURI === savedURI);
      if (found) {
        selectedVoice = found;
        return;
      }
    }
  } catch { /* ignore */ }

  // Default: pick a good English voice
  if (!selectedVoice) {
    selectedVoice =
      voices.find(v => v.lang.startsWith('en') && v.default) ||
      voices.find(v => v.lang.startsWith('en-US')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];
  }
}

export function setSelectedVoice(voice) {
  selectedVoice = voice;
}

export function initSpeech() {
  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
  }
  if (window.speechSynthesis.getVoices().length > 0) loadVoices();
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
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);

    // Chrome bug workaround: keep-alive by pausing/resuming
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
