import { useEffect, useRef, useState } from 'react';
import { Plus, Minus, RotateCcw, Info } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks';

type Charge = { id: number; x: number; y: number; q: number };

/**
 * Educational electric-field visualization.
 * Approximates E = kq/r² across a grid; draws field-direction lines.
 * Not a full electromagnetic simulation — a graphical approximation.
 */
export default function ElectricFieldExplorer() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [charges, setCharges] = useState<Charge[]>([
    { id: 1, x: 0.35, y: 0.5, q: 1 },
    { id: 2, x: 0.65, y: 0.5, q: -1 },
  ]);
  const [dragging, setDragging] = useState<number | null>(null);
  const nextId = useRef(3);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const fieldAt = (px: number, py: number, w: number, h: number) => {
      let ex = 0;
      let ey = 0;
      for (const c of charges) {
        const cxp = c.x * w;
        const cyp = c.y * h;
        const dx = px - cxp;
        const dy = py - cyp;
        const r2 = dx * dx + dy * dy + 120;
        const mag = (c.q * 1400) / r2;
        const r = Math.sqrt(r2);
        ex += (mag * dx) / r;
        ey += (mag * dy) / r;
      }
      return { ex, ey };
    };

    const draw = () => {
      t += 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(5,8,17,0.6)';
      ctx.fillRect(0, 0, w, h);

      // grid
      ctx.strokeStyle = 'rgba(67,230,255,0.05)';
      ctx.lineWidth = 1;
      const grid = 40;
      for (let x = grid; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = grid; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // field direction arrows on a grid
      const step = 34;
      for (let px = step / 2; px < w; px += step) {
        for (let py = step / 2; py < h; py += step) {
          const { ex, ey } = fieldAt(px, py, w, h);
          const mag = Math.sqrt(ex * ex + ey * ey);
          if (mag < 0.01) continue;
          const len = Math.min(14, mag * 6);
          const nx = ex / mag;
          const ny = ey / mag;
          const alpha = Math.min(0.55, 0.06 + mag * 0.02);
          ctx.strokeStyle = `rgba(67,230,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px - (nx * len) / 2, py - (ny * len) / 2);
          ctx.lineTo(px + (nx * len) / 2, py + (ny * len) / 2);
          ctx.stroke();
          // arrowhead
          ctx.beginPath();
          ctx.arc(px + (nx * len) / 2, py + (ny * len) / 2, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(67,230,255,${alpha})`;
          ctx.fill();
        }
      }

      // animated streamlines (a few field lines from positive charges)
      if (!reduced) {
        const pos = charges.filter((c) => c.q > 0);
        let lineIdx = 0;
        for (const c of pos) {
          for (let k = 0; k < 6; k++) {
            const startA = (k / 6) * Math.PI * 2 + t * 0.001;
            const cxp = c.x * w;
            const cyp = c.y * h;
            let px = cxp + Math.cos(startA) * 12;
            let py = cyp + Math.sin(startA) * 12;
            ctx.beginPath();
            ctx.moveTo(px, py);
            for (let s = 0; s < 60; s++) {
              const { ex, ey } = fieldAt(px, py, w, h);
              const mag = Math.sqrt(ex * ex + ey * ey);
              if (mag < 0.001) break;
              px += (ex / mag) * 4;
              py += (ey / mag) * 4;
              if (px < 0 || px > w || py < 0 || py > h) break;
              ctx.lineTo(px, py);
            }
            ctx.strokeStyle = `rgba(67,230,255,${0.18 - lineIdx * 0.005})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            lineIdx++;
          }
        }
      }

      // charges
      for (const c of charges) {
        const cxp = c.x * w;
        const cyp = c.y * h;
        const color = c.q > 0 ? '#43e6ff' : '#ffb454';
        ctx.beginPath();
        ctx.arc(cxp, cyp, 12, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#03050c';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.q > 0 ? '+' : '−', cxp, cyp + 1);
      }

      raf = requestAnimationFrame(draw);
    };
    if (!reduced) draw();
    else { draw(); cancelAnimationFrame(raf); }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [charges, reduced]);

  const pos = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { x, y } = pos(e);
    // hit-test charges
    for (const c of charges) {
      const dx = (c.x - x) * ref.current!.clientWidth;
      const dy = (c.y - y) * ref.current!.clientHeight;
      if (Math.sqrt(dx * dx + dy * dy) < 20) {
        setDragging(c.id);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging == null) return;
    const { x, y } = pos(e);
    setCharges((cs) => cs.map((c) => (c.id === dragging ? { ...c, x: Math.max(0.02, Math.min(0.98, x)), y: Math.max(0.02, Math.min(0.98, y)) } : c)));
  };

  const endDrag = () => setDragging(null);

  const add = (q: number) => {
    setCharges((cs) => [...cs, { id: nextId.current++, x: 0.5 + (Math.random() - 0.5) * 0.3, y: 0.5 + (Math.random() - 0.5) * 0.3, q }]);
  };
  const reset = () => {
    nextId.current = 3;
    setCharges([
      { id: 1, x: 0.35, y: 0.5, q: 1 },
      { id: 2, x: 0.65, y: 0.5, q: -1 },
    ]);
  };

  return (
    <section id="lab" className="section">
      <p className="t-label">06 · Interactive Lab</p>
      <h2 className="section-title">Electric field explorer.</h2>
      <p className="section-sub">
        An educational sandbox. Add positive and negative charges, drag them around, and watch the field-direction grid and streamlines update.
      </p>

      <div className="mt-8 panel frame p-3 sm:p-4">
        <div className="relative">
          <canvas
            ref={ref}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="w-full h-[380px] sm:h-[460px] rounded-lg touch-none cursor-grab active:cursor-grabbing"
            aria-label="Electric field explorer canvas. Drag charges to move them."
          />
          <span className="absolute top-3 left-3 mono text-[0.6rem] tracking-[0.2em] text-fg-dim pointer-events-none">
            EDUCATIONAL VISUALIZATION
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={() => add(1)} className="btn btn-ghost text-sm">
            <Plus size={14} /> Add positive
          </button>
          <button onClick={() => add(-1)} className="btn btn-ghost text-sm">
            <Minus size={14} /> Add negative
          </button>
          <button onClick={reset} className="btn btn-ghost text-sm">
            <RotateCcw size={14} /> Reset
          </button>
          <span className="ml-auto text-xs text-fg-dim mono">{charges.length} charges</span>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-fg-dim leading-relaxed">
          <Info size={14} className="shrink-0 mt-0.5 text-fg-dim" />
          <span>
            This is a graphical approximation of E = kq/r² across a grid — a visualization, not a full electromagnetic simulation. Field lines are computed by stepping along the local field vector.
          </span>
        </div>
      </div>
    </section>
  );
}
