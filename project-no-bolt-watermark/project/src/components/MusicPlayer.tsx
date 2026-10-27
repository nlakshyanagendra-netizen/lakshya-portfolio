import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, AlertCircle } from 'lucide-react';
import { site } from '@/config/site';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';

const TRACK = '/ambient-track.mp3';

export default function MusicPlayer() {
  const { soundEnabled, toggleSound } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.45;

    const onCanPlay = () => { setReady(true); setError(false); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setError(true);

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.load();

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Attempt autoplay (muted). Unmute on first interaction if sound is enabled.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !soundEnabled;
    audio.play().then(() => setPlaying(true)).catch(() => {
      // Autoplay blocked — wait for first interaction.
    });
  }, [ready]);

  useEffect(() => {
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio || error) return;
      if (soundEnabled) {
        audio.muted = false;
        audio.volume = 0.45;
        audio.play().then(() => setPlaying(true)).catch(() => setError(true));
      }
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [soundEnabled, error]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    audio.muted = !soundEnabled;
    if (!soundEnabled) audio.volume = 0;
    else audio.volume = 0.45;
  }, [soundEnabled, ready]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (playing) audio.pause();
    else audio.play().then(() => setPlaying(true)).catch(() => setError(true));
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-3">
      <audio ref={audioRef} src={TRACK} loop preload="auto" />
      <div className="flex items-end gap-0.5 h-6" aria-hidden="true">
        {playing && !error ? (
          [0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-1 bg-cyan rounded-full eq-bar"
              style={{ animationDelay: `${i * 0.12}s`, height: '40%' }}
            />
          ))
        ) : (
          <span className={cn('w-1.5 h-1.5 rounded-full', error ? 'bg-error' : ready ? 'bg-cyan' : 'bg-fg-dim')} />
        )}
      </div>

      <div
        className="panel frame flex items-center gap-2 px-3 py-2 transition-all"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <Music size={14} className="text-cyan shrink-0" />

        <button
          onClick={togglePlay}
          disabled={!ready || error}
          className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-fg hover:text-cyan hover:border-cyan/50 transition-colors disabled:opacity-40"
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          {error ? (
            <AlertCircle size={13} className="text-error" />
          ) : playing ? (
            <Pause size={13} />
          ) : (
            <Play size={13} />
          )}
        </button>

        <button
          onClick={toggleSound}
          className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-fg hover:text-cyan hover:border-cyan/50 transition-colors"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>

        <span className="mono text-[0.65rem] text-fg-dim tracking-wider hidden sm:block max-w-[160px] truncate">
          {error ? 'Unavailable' : !ready ? 'Loading…' : playing ? (soundEnabled ? site.youtubeTitle : 'Playing (muted)') : 'Paused'}
        </span>
      </div>

      {error && (
        <p className="absolute -top-7 left-0 text-[0.65rem] text-error mono whitespace-nowrap">
          Track unavailable
        </p>
      )}
    </div>
  );
}
