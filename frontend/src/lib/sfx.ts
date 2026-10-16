/**
 * Tiny synthesized sound effects (Web Audio, nothing to download): soft
 * pulse-wave blips for the tamagotchi keys, a paper flick for the profile
 * prints, a crackle for a sticker coming off its sheet.
 * Muting is remembered per browser.
 */

export type SfxName = "feed" | "play" | "sleep" | "wake" | "guess" | "win" | "miss" | "peel" | "print";

const MUTE_KEY = "sfx-muted";
let muted = false;
try {
  muted = localStorage.getItem(MUTE_KEY) === "1";
} catch {
  /* storage blocked: sound stays on */
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let crackle: AudioBuffer | null = null;
const waves = new Map<number, PeriodicWave>();

function audio(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** A pulse wave of the given duty cycle, built from its Fourier series. */
function pulse(duty: number): PeriodicWave {
  let w = waves.get(duty);
  if (!w) {
    const re = new Float32Array(64);
    const im = new Float32Array(64);
    for (let n = 1; n < 64; n++) {
      re[n] = (2 / (n * Math.PI)) * Math.sin(2 * Math.PI * n * duty);
      im[n] = (2 / (n * Math.PI)) * (1 - Math.cos(2 * Math.PI * n * duty));
    }
    w = ctx!.createPeriodicWave(re, im);
    waves.set(duty, w);
  }
  return w;
}

/** One chiptune note: quarter-duty pulse through a lowpass, held then released. */
function blip(freq: number, at: number, dur: number, peak = 0.5, glideTo?: number) {
  const c = ctx!;
  const osc = c.createOscillator();
  const amp = c.createGain();
  const lp = c.createBiquadFilter();
  osc.setPeriodicWave(pulse(0.25));
  osc.frequency.setValueAtTime(freq, at);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, at + dur);
  const level = peak * 0.8;
  amp.gain.setValueAtTime(1e-4, at);
  amp.gain.exponentialRampToValueAtTime(level, at + 0.008);
  amp.gain.setValueAtTime(level, at + Math.max(0.008, dur - 0.02));
  amp.gain.linearRampToValueAtTime(1e-4, at + dur);
  lp.type = "lowpass";
  lp.frequency.value = 3000;
  lp.Q.value = 0.5;
  osc.connect(lp).connect(amp).connect(master!);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

/** Sparse random clicks: the grain of paper and sticker backing. */
function crackles(c: AudioContext): AudioBuffer {
  if (!crackle) {
    const rate = c.sampleRate;
    const len = rate * 2;
    crackle = c.createBuffer(1, len, rate);
    const d = crackle.getChannelData(0);
    let i = 0;
    for (;;) {
      i += Math.floor((-Math.log(1 - Math.random()) * rate) / 500);
      if (i >= len) break;
      const n = Math.floor(rate * (0.0005 + Math.random() * 0.0015));
      const a = 0.25 + Math.pow(Math.random(), 3) * 0.75;
      for (let k = 0; k < n && i + k < len; k++) d[i + k] += (Math.random() * 2 - 1) * a * Math.exp((-5 * k) / n);
    }
  }
  return crackle;
}

function noiseBurst(at: number, dur: number, peak: number, buffer: AudioBuffer, rate: number, highpass: number) {
  const c = ctx!;
  const src = c.createBufferSource();
  const hp = c.createBiquadFilter();
  const amp = c.createGain();
  src.buffer = buffer;
  src.loop = true;
  src.playbackRate.value = rate;
  hp.type = "highpass";
  hp.frequency.value = highpass;
  amp.gain.setValueAtTime(1e-4, at);
  amp.gain.exponentialRampToValueAtTime(peak, at + 0.004);
  amp.gain.exponentialRampToValueAtTime(1e-4, at + dur);
  src.connect(hp).connect(amp).connect(master!);
  src.start(at, Math.random() * 0.5);
  src.stop(at + dur + 0.02);
}

const SOUNDS: Record<SfxName, (t: number) => void> = {
  feed: (t) => blip(1175, t, 0.08, 0.35),
  play: (t) => {
    blip(1175, t, 0.07, 0.3);
    blip(1319, t + 0.11, 0.08, 0.3);
  },
  sleep: (t) => blip(880, t, 0.09, 0.3),
  wake: (t) => blip(1175, t, 0.08, 0.35),
  guess: (t) => blip(1175, t, 0.05, 0.25),
  win: (t) => {
    blip(1319, t, 0.07, 0.3);
    blip(1760, t + 0.1, 0.11, 0.3);
  },
  miss: (t) => blip(196, t, 0.1, 0.18, 131),
  peel: (t) => noiseBurst(t, 0.12, 1, crackles(ctx!), 1.5, 1800),
  print: (t) => {
    noiseBurst(t, 0.13, 0.15, noise!, 1, 1800);
    noiseBurst(t + 0.04, 0.03, 0.4, crackles(ctx!), 2.6, 1500);
  },
};

export function play(name: SfxName) {
  if (muted) return;
  const c = audio();
  if (c) SOUNDS[name](c.currentTime + 0.005);
}

export const isMuted = () => muted;

export function setMuted(on: boolean) {
  muted = on;
  try {
    localStorage.setItem(MUTE_KEY, on ? "1" : "0");
  } catch {
    /* not remembered */
  }
}
