// Text-to-speech helper — proper voice loading + user-gesture unlock

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

// Call once on app mount to pre-load voices
export function initSpeech() {
  if (!('speechSynthesis' in window)) return;
  // Chrome loads voices async
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => loadVoice();
  }
  // Firefox/Safari may already have voices
  if (window.speechSynthesis.getVoices().length > 0) loadVoice();
}

// Call on first user tap to unlock audio on mobile browsers
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

  // Small delay helps Chrome after cancel()
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voice = loadVoice();
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);

    // Chrome bug: resume periodically to prevent stalling
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
