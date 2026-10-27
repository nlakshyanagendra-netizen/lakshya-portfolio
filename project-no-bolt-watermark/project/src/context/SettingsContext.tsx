import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useStoredState } from '@/hooks';

type SettingsContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  setSound: (v: boolean) => void;
  petVisible: boolean;
  setPetVisible: (v: boolean) => void;
  // Short chime used by the pet on wink. Plays only if sound enabled.
  playChime: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

/** A bright metallic ring / bell chime synthesized via the Web Audio API.
 *  Strike transient + inharmonic bell partials + a soft tail — like
 *  tapping a small metal bowl. No audio files. */
function createChime(ctx: AudioContext) {
  const now = ctx.currentTime;
  const dest = ctx.destination;

  // --- Strike transient (short noise burst) for the "ting" attack ---
  const noiseBuf = ctx.createBuffer(1, 1024, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.18, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(5200, now);
  noiseFilter.Q.setValueAtTime(2, now);
  noise.connect(noiseFilter).connect(noiseGain).connect(dest);
  noise.start(now);
  noise.stop(now + 0.15);

  // --- Bell partials (inharmonic, like a real metal bell) ---
  const partials = [
    { f: 784.0, amp: 0.55, dec: 2.6 },   // hum (fundamental-ish)
    { f: 1318.5, amp: 0.42, dec: 2.2 },  // tierce
    { f: 2349.3, amp: 0.30, dec: 1.8 },  // quint
    { f: 3136.0, amp: 0.22, dec: 1.4 },  // nominal
    { f: 4698.6, amp: 0.12, dec: 0.9 },  // shimmer
  ];

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.7, now + 0.004);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
  master.connect(dest);

  partials.forEach((p, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.f, now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(p.amp, now + 0.003 + i * 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, now + p.dec);
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + p.dec + 0.1);
  });
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSound] = useStoredState('lakshya.sound', true);
  const [petVisible, setPetVisible] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      try {
        const Ctor = window.AudioContext || (window as any).webkitAudioContext;
        audioRef.current = new Ctor();
      } catch {
        return null;
      }
    }
    if (audioRef.current.state === 'suspended') {
      void audioRef.current.resume();
    }
    return audioRef.current;
  }, []);

  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      createChime(ctx);
    } catch {
      /* ignore audio errors */
    }
  }, [soundEnabled, ensureAudio]);

  // Unlock the audio context on the first user interaction if sound is enabled.
  useEffect(() => {
    if (!soundEnabled) return;
    const unlock = () => ensureAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [soundEnabled, ensureAudio]);

  const value = useMemo(
    () => ({
      soundEnabled,
      toggleSound: () => setSound(!soundEnabled),
      setSound,
      petVisible,
      setPetVisible,
      playChime,
    }),
    [soundEnabled, setSound, petVisible, playChime]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
