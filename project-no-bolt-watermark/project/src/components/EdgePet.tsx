import { useEffect, useRef, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { petMessages } from '@/config/site';
import { useSettings } from '@/context/SettingsContext';
import { useActiveSection, usePrefersReducedMotion } from '@/hooks';
import { pointer } from '@/lib/pointer';

type State = 'hidden' | 'peek' | 'wink' | 'clicked';

const SIZE = 130; // px — bigger pet

/**
 * Tiny futuristic creature that peeks out from the right viewport edge.
 * Subtle, dismissible, never covers important content.
 * Publishes its bounds to the shared pointer store so the background
 * reduces electrical sparks as the cursor approaches the pet.
 */
export default function EdgePet() {
  const { soundEnabled, playChime, petVisible, setPetVisible } = useSettings();
  const reduced = usePrefersReducedMotion();
  const active = useActiveSection(['home', 'projects', 'achievements', 'contact']);
  const [state, setState] = useState<State>('hidden');
  const [msg, setMsg] = useState<string | null>(null);
  const [sparkle, setSparkle] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const timers = useRef<number[]>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const msgTimer = useRef<number | null>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = null;
  };

  // Single owner for the bubble timer so overlapping messages can't leave a stale bubble behind.
  const showMsg = (text: string, duration: number) => {
    if (msgTimer.current) clearTimeout(msgTimer.current);
    setMsg(text);
    msgTimer.current = window.setTimeout(() => {
      setMsg(null);
      msgTimer.current = null;
    }, duration);
  };

  const hidePet = () => {
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = null;
    setMsg(null);
    setState('hidden');
  };

  // Publish pet bounds to the shared pointer store (for spark reduction).
  useEffect(() => {
    if (!petVisible) {
      pointer.setPetBounds(null);
      return;
    }
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      pointer.setPetBounds({ x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.max(r.width, r.height) / 2 });
    };
    update();
    const id = window.setInterval(update, 500);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      clearInterval(id);
      window.removeEventListener('scroll', update);
      pointer.setPetBounds(null);
    };
  }, [petVisible]);

  // Peek/chat cycle — the pet talks on its own. NO chime on auto-cycle;
  // chime only fires when the user clicks the pet.
  useEffect(() => {
    if (!petVisible || reduced) {
      if (petVisible && reduced) setState('peek');
      return;
    }
    const cycle = () => {
      setState('peek');
      timers.current.push(window.setTimeout(() => {
        // wink occasionally (visual only — no sound)
        if (Math.random() < 0.4) {
          setState('wink');
          setSparkle(true);
          timers.current.push(window.setTimeout(() => setSparkle(false), 600));
          timers.current.push(window.setTimeout(() => setState('peek'), 900));
        }
        // spontaneously say something on its own
        if (Math.random() < 0.5) {
          showMsg(petMessages[Math.floor(Math.random() * petMessages.length)], 3200);
        }
        timers.current.push(window.setTimeout(hidePet, 4500));
        timers.current.push(window.setTimeout(cycle, 9000 + Math.random() * 7000));
      }, 2000));
    };
    const start = window.setTimeout(cycle, 2500);
    timers.current.push(start);
    return clearTimers;
  }, [petVisible, reduced]);

  // React to entering certain sections
  useEffect(() => {
    if (!petVisible || reduced) return;
    if (active === 'projects' || active === 'achievements' || active === 'contact') {
      setState('peek');
      showMsg(petMessages[Math.floor(Math.random() * petMessages.length)], 3500);
      timers.current.push(window.setTimeout(hidePet, 4500));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!petVisible) return null;

  const handleClick = () => {
    setState('clicked');
    const text = easterEgg
      ? 'You found the hidden spark. Curiosity rewarded.'
      : petMessages[Math.floor(Math.random() * petMessages.length)];
    showMsg(text, 2600);
    setSparkle(true);
    if (soundEnabled) playChime();
    timers.current.push(window.setTimeout(() => {
      setSparkle(false);
      setState('peek');
    }, 2600));
  };

  const offsetX = state === 'hidden' ? 'translate-x-[78%]' : state === 'clicked' ? 'translate-x-3' : 'translate-x-10';

  return (
    <div
      className="fixed right-0 bottom-6 sm:bottom-10 z-40 select-none"
      style={{ animation: 'fadeIn 0.5s both' }}
      aria-live="polite"
    >
      {/* Speech bubble — anchored to the untranslated container so it never slides past the viewport edge */}
      {msg && state !== 'hidden' && (
        <div className="absolute bottom-full right-3 mb-2 panel px-3 py-2 w-max max-w-[min(240px,calc(100vw-1.5rem))] animate-fade-in">
          <p className="text-xs text-fg-bright leading-snug break-words">{msg}</p>
          <span className="absolute -bottom-1 right-16 w-2 h-2 bg-panel border-b border-l border-line rotate-[-45deg]" />
        </div>
      )}

      <div ref={wrapRef} className={`relative transition-transform duration-500 ${offsetX}`} style={{ width: SIZE, height: SIZE + 16 }}>

        {/* Dismiss */}
        <button
          onClick={() => setPetVisible(false)}
          className="absolute top-0 right-2 w-6 h-6 rounded-full bg-deep border border-line text-fg-dim hover:text-error flex items-center justify-center"
          aria-label="Dismiss pet"
        >
          <X size={13} />
        </button>

        {/* Sparkle on wink */}
        {sparkle && (
          <span className="absolute top-2 right-6 text-cyan animate-pulse-soft" aria-hidden="true">
            <Sparkles size={18} />
          </span>
        )}

        {/* The creature */}
        <button
          onClick={handleClick}
          onDoubleClick={() => setEasterEgg((v) => !v)}
          className="block cursor-pointer"
          aria-label="Pet creature — click for a message"
        >
          <svg width={SIZE} height={SIZE + 16} viewBox="0 0 64 80" className="drop-shadow-[0_0_14px_rgba(67,230,255,0.35)]">
            {/* antennae */}
            <line x1="24" y1="16" x2="20" y2="4" stroke="#43e6ff" strokeWidth="1.6" />
            <line x1="40" y1="16" x2="44" y2="4" stroke="#43e6ff" strokeWidth="1.6" />
            <circle cx="20" cy="4" r="2.4" fill="#43e6ff" />
            <circle cx="44" cy="4" r="2.4" fill="#43e6ff" />
            {/* body */}
            <ellipse cx="32" cy="46" rx="24" ry="28" fill="#0a1830" stroke="#43e6ff" strokeWidth="1.8" />
            <ellipse cx="32" cy="46" rx="15" ry="19" fill="#0d1f3a" />
            {/* eyes */}
            {state === 'wink' ? (
              <g>
                <circle cx="24" cy="40" r="4.5" fill="#8bf1ff" className="blink" />
                <path d="M36 40 Q41 40 41 40" stroke="#8bf1ff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <circle cx="24" cy="40" r="5" fill="#43e6ff" className="blink" />
                <circle cx="40" cy="40" r="5" fill="#43e6ff" className="blink" />
                <circle cx="25" cy="39" r="1.7" fill="#03050c" />
                <circle cx="41" cy="39" r="1.7" fill="#03050c" />
              </g>
            )}
            {/* mouth */}
            {state === 'clicked' ? (
              <path d="M25 54 Q32 62 39 54" stroke="#43e6ff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M27 54 Q32 57 37 54" stroke="#43e6ff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            )}
            {/* feet */}
            <ellipse cx="23" cy="73" rx="4.5" ry="2.5" fill="#43e6ff" opacity="0.6" />
            <ellipse cx="41" cy="73" rx="4.5" ry="2.5" fill="#43e6ff" opacity="0.6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
