import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 22050;
const bpm = 120;
const beatSeconds = 60 / bpm;
const totalBeats = 32;
const duration = totalBeats * beatSeconds;
const outDir = path.resolve('tmp/audio');

function clamp(value) {
  return Math.max(-1, Math.min(1, value));
}

function sine(freq, time) {
  return Math.sin(Math.PI * 2 * freq * time);
}

function triangle(freq, time) {
  return (2 / Math.PI) * Math.asin(sine(freq, time));
}

function pluck(freq, localTime, noteDuration) {
  if (localTime < 0 || localTime >= noteDuration) {
    return 0;
  }

  const attack = Math.min(1, localTime / 0.012);
  const decay = Math.exp(-localTime * 4.6);
  const release = Math.min(1, (noteDuration - localTime) / 0.06);
  return attack * decay * release * (
    0.72 * sine(freq, localTime)
    + 0.2 * sine(freq * 2, localTime)
    + 0.08 * triangle(freq * 0.5, localTime)
  );
}

function seededNoise(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return (value / 0xffffffff) * 2 - 1;
  };
}

function writeWav(filePath, samples) {
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
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }
  fs.writeFileSync(filePath, buffer);
}

const melody = [
  659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 587.33,
  659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 587.33, 659.25,
  698.46, 880.00, 987.77, 880.00, 698.46, 659.25, 587.33, 659.25,
  783.99, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25,
];
const chords = [
  [261.63, 329.63, 392.00],
  [220.00, 261.63, 329.63],
  [174.61, 220.00, 261.63],
  [196.00, 246.94, 293.66],
];
const bassRoots = [130.81, 110.00, 87.31, 98.00];
const noise = seededNoise(20260618);
const samples = new Int16Array(Math.floor(duration * sampleRate));

for (let i = 0; i < samples.length; i++) {
  const time = i / sampleRate;
  const beat = time / beatSeconds;
  const beatIndex = Math.floor(beat);
  const beatLocal = time - beatIndex * beatSeconds;
  const chordIndex = Math.floor(beatIndex / 8) % chords.length;
  const eighthIndex = Math.floor(time / (beatSeconds / 2));
  const eighthLocal = time - eighthIndex * (beatSeconds / 2);

  const melodyTone = pluck(melody[eighthIndex % melody.length], eighthLocal, beatSeconds * 0.46);
  const bassTone = pluck(bassRoots[chordIndex], beatLocal, beatSeconds * 0.72);
  const pad = chords[chordIndex].reduce((sum, freq) => sum + sine(freq, time), 0) / 3;

  const shakerPhase = time % (beatSeconds / 2);
  const shakerEnvelope = shakerPhase < 0.055 ? Math.exp(-shakerPhase * 55) : 0;
  const shaker = noise() * shakerEnvelope;

  const barAccent = beatIndex % 4 === 0
    ? pluck(1046.50, beatLocal, 0.14)
    : 0;
  const mixed = 0.24 * melodyTone
    + 0.12 * bassTone
    + 0.055 * pad
    + 0.02 * shaker
    + 0.035 * barAccent;

  // 首尾留出极短的无点击过渡，循环时不会产生爆音。
  const edgeFade = Math.min(1, time / 0.025, (duration - time) / 0.025);
  samples[i] = Math.round(clamp(mixed * Math.max(0, edgeFade)) * 32767);
}

fs.mkdirSync(outDir, { recursive: true });
writeWav(path.join(outDir, 'bgm_meadow_loop.wav'), samples);
console.log(`Generated ${duration}s loop at ${sampleRate}Hz`);
