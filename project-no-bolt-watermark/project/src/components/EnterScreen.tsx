import { useCallback, useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { site } from '@/config/site';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'strike' | 'reveal';

type Point = { x: number; y: number };

const STRIKE_MS = 900;
const REVEAL_MS = 700;

function buildBolt(from: Point, to: Point, roughness: number, depth = 0): Point[] {
  if (depth > 6) return [from, to];
  const mid = {
    x: (from.x + to.x) / 2 + (Math.random() - 0.5) * roughness,
    y: (from.y + to.y) / 2 + (Math.random() - 0.5) * roughness,
  };
  const left = buildBolt(from, mid, roughness / 2, depth + 1);
  const right = buildBolt(mid, to, roughness / 2, depth + 1);
  return [...left.slice(0, -1), ...right];
}

function randomEdgePoint(w: number, h: number): Point {
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: Math.random() * w, y: -20 };
  if (side === 1) return { x: w + 20, y: Math.random() * h };
  if (side === 2) return { x: Math.random() * w, y: h + 20 };
  return { x: -20, y: Math.random() * h };
}

function strokeBolt(ctx: CanvasRenderingContext2D, pts: Point[], width: number, alpha: number) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.shadowColor = '#43e6ff';
  ctx.shadowBlur = 24;
  ctx.strokeStyle = `rgba(67, 230, 255, ${alpha * 0.6})`;
  ctx.lineWidth = width * 3;
  ctx.stroke();
  ctx.shadowBlur = 8;
  ctx.strokeStyle = `rgba(243, 247, 255, ${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

export default function EnterScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    buttonRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  const runLightning = useCallback((origin: Point) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const start = performance.now();
    let lastSpawn = 0;
    let bolts: { pts: Point[]; born: number; width: number }[] = [];
    let raf = 0;

    const frame = (now: number) => {
      const t = now - start;
      if (t - lastSpawn > 55 && t < STRIKE_MS - 120) {
        lastSpawn = t;
        const count = 1 + Math.floor((t / STRIKE_MS) * 4);
        for (let i = 0; i < count; i++) {
          const target = randomEdgePoint(w, h);
          const dist = Math.hypot(target.x - origin.x, target.y - origin.y);
          bolts.push({ pts: buildBolt(origin, target, dist * 0.35), born: t, width: 1 + Math.random() * 2 });
        }
      }
      ctx.clearRect(0, 0, w, h);
      bolts = bolts.filter((b) => t - b.born < 260);
      for (const b of bolts) {
        const life = 1 - (t - b.born) / 260;
        const flicker = Math.random() > 0.15 ? 1 : 0.3;
        strokeBolt(ctx, b.pts, b.width, life * flicker);
      }
      if (t < STRIKE_MS + REVEAL_MS) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const enter = useCallback(() => {
    if (phase !== 'idle') return;
    window.dispatchEvent(new Event('portfolio:enter'));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase('reveal');
      setTimeout(onDone, 300);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setPhase('strike');
    runLightning(origin);
    setTimeout(() => setPhase('reveal'), STRIKE_MS);
    setTimeout(onDone, STRIKE_MS + REVEAL_MS);
  }, [phase, onDone, runLightning]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enter ${site.name}'s portfolio`}
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-base',
        phase === 'strike' && 'enter-shake',
        phase === 'reveal' && 'enter-reveal pointer-events-none',
      )}
    >
      <div className="absolute inset-0 enter-grid" aria-hidden="true" />
      <div className="absolute inset-0 enter-vignette" aria-hidden="true" />

      <div
        className={cn(
          'relative flex flex-col items-center gap-10 px-6 text-center transition-opacity duration-300',
          phase !== 'idle' && 'opacity-0',
        )}
      >
        <div className="flex flex-col items-center gap-3 animate-fade-up">
          <span className="mono text-[0.7rem] tracking-[0.35em] uppercase text-cyan">
            System ready
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold text-fg-bright text-balance leading-tight">
            {site.name}
          </h1>
          <p className="text-sm sm:text-base text-fg-muted max-w-md text-pretty">{site.tagline}</p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={enter}
          className="group relative flex items-center justify-center w-32 h-32 rounded-full focus:outline-none animate-scale-in"
        >
          <span className="absolute inset-0 rounded-full border border-cyan/40 enter-ring" aria-hidden="true" />
          <span className="absolute inset-2 rounded-full border border-cyan/20 enter-ring enter-ring-delay" aria-hidden="true" />
          <span className="absolute inset-4 rounded-full bg-panel border border-cyan/60 shadow-[0_0_40px_rgba(67,230,255,0.35)] transition-all duration-300 group-hover:shadow-[0_0_70px_rgba(67,230,255,0.7)] group-hover:border-cyan group-focus-visible:border-cyan group-focus-visible:shadow-[0_0_70px_rgba(67,230,255,0.7)]" aria-hidden="true" />
          <span className="relative flex flex-col items-center gap-1">
            <Zap size={22} className="text-cyan transition-transform duration-300 group-hover:scale-125" />
            <span className="mono text-xs tracking-[0.3em] uppercase text-fg-bright">Enter</span>
          </span>
        </button>

        <p className="mono text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim">
          Sound on for the full experience
        </p>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
      {phase !== 'idle' && <div className="absolute inset-0 pointer-events-none enter-flash" aria-hidden="true" />}
    </div>
  );
}
