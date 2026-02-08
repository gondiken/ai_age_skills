// Text-to-speech helper for the 6-year-old who can't fully read yet
export function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  // Try to pick an English voice
  const voices = window.speechSynthesis.getVoices();
  const english = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
    || voices.find(v => v.lang.startsWith('en'))
    || voices[0];
  if (english) utterance.voice = english;
  window.speechSynthesis.speak(utterance);
}
