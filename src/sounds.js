// Sound effects using Web Audio API — zero dependencies
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* silently skip */ }
}

export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.25);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.25), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
}

export function playWrong() {
  playTone(200, 0.25, 'square', 0.12);
  setTimeout(() => playTone(180, 0.25, 'square', 0.1), 100);
}

export function playTap() {
  playTone(880, 0.05, 'sine', 0.15);
}

export function playCelebrate() {
  [523, 587, 659, 784, 880, 1047].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 80);
  });
}
