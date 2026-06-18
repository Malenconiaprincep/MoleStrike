import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 44100;
const outDir = path.resolve('assets/resources/audio');

function clamp(value) {
  return Math.max(-1, Math.min(1, value));
}

function envelope(t, duration, attack = 0.01, release = 0.08) {
  const fadeIn = Math.min(1, t / attack);
  const fadeOut = Math.min(1, (duration - t) / release);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

function sine(freq, t) {
  return Math.sin(Math.PI * 2 * freq * t);
}

function square(freq, t) {
  return sine(freq, t) >= 0 ? 1 : -1;
}

function makeTone(duration, synth) {
  const samples = Math.floor(sampleRate * duration);
  const data = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    data[i] = Math.round(clamp(synth(t, duration)) * 32767);
  }
  return data;
}

function writeWav(fileName, samples) {
  const byteRate = sampleRate * 2;
  const blockAlign = 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }

  fs.writeFileSync(path.join(outDir, fileName), buffer);
}

function noise(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return (value / 0xffffffff) * 2 - 1;
  };
}

const buttonClick = makeTone(0.14, (t, d) => {
  const freq = t < 0.055 ? 760 : 1040;
  return 0.28 * envelope(t, d, 0.003, 0.04) * (0.72 * sine(freq, t) + 0.18 * square(freq * 2, t));
});

const moleAppear = makeTone(0.28, (t, d) => {
  const progress = t / d;
  const freq = 180 + progress * 520;
  return 0.33 * envelope(t, d, 0.006, 0.08) * (sine(freq, t) + 0.22 * sine(freq * 1.8, t));
});

const hitMole = makeTone(0.24, (t, d) => {
  const progress = t / d;
  const freq = 260 - progress * 130;
  const thump = Math.exp(-progress * 8);
  return 0.42 * envelope(t, d, 0.002, 0.09) * (thump * sine(freq, t) + 0.18 * square(freq * 0.5, t));
});

const countdownEnd = makeTone(0.65, (t, d) => {
  const note = t < 0.2 ? 660 : t < 0.42 ? 880 : 1180;
  return 0.27 * envelope(t, d, 0.006, 0.1) * (sine(note, t) + 0.2 * sine(note * 2, t));
});

const winNoise = noise(42);
const gameWin = makeTone(1.1, (t, d) => {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const index = Math.min(notes.length - 1, Math.floor(t / 0.22));
  const sparkle = 0.035 * winNoise() * Math.exp(-Math.max(0, t - 0.62) * 3);
  return 0.22 * envelope(t, d, 0.01, 0.2) * (sine(notes[index], t) + 0.22 * sine(notes[index] * 2, t)) + sparkle;
});

writeWav('sfx_button_click.wav', buttonClick);
writeWav('sfx_mole_appear.wav', moleAppear);
writeWav('sfx_hit_mole.wav', hitMole);
writeWav('sfx_countdown_end.wav', countdownEnd);
writeWav('sfx_game_win.wav', gameWin);

console.log(`Generated 5 wav files in ${outDir}`);
