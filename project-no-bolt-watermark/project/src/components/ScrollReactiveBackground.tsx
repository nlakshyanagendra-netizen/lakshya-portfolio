import { useEffect, useRef } from 'react';
import { useLowPerf, usePrefersReducedMotion, useScrollProgress } from '@/hooks';
import { pointer } from '@/lib/pointer';

type Particle = { x: number; y: number; vx: number; vy: number; orbit: number; radius: number; size: number; phase: number; charge: 1 | -1 };
type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number };

type Palette = { cyan: string; blue: string; amber: string };

const palette: Palette = { cyan: '67,230,255', blue: '74,141,255', amber: '255,180,84' };

function arc(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, alpha: number, jitter: number) {
  const steps = 8;
  let px = x1;
  let py = y1;
  ctx.beginPath();
  ctx.moveTo(px, py);
  for (let i = 1; i <= steps; i++) {
    const k = i / steps;
    px = x1 + (x2 - x1) * k + (Math.random() - 0.5) * jitter;
    py = y1 + (y2 - y1) * k + (Math.random() - 0.5) * jitter;
    ctx.lineTo(px, py);
  }
  ctx.strokeStyle = `rgba(${palette.cyan},${alpha * 0.3})`;
  ctx.lineWidth = 4;
  ctx.shadowColor = `rgba(${palette.cyan},0.95)`;
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.strokeStyle = `rgba(210,250,255,${alpha})`;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export default function ScrollReactiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const lowPerf = useLowPerf();
  const scroll = useScrollProgress();
  const scrollRef = useRef(scroll);
  scrollRef.current = scroll;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    const particles: Particle[] = [];
    let embers: Ember[] = [];
    const count = reduced ? 28 : lowPerf ? 54 : 86;

    const spawnEmbers = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;
        embers.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: -Math.abs(Math.sin(angle) * speed) - 0.3, // bias upward
          life: 0,
          max: 30 + Math.random() * 40,
          size: 1 + Math.random() * 2.5,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) {
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            orbit: 80 + Math.random() * Math.min(width, height) * 0.45,
            radius: 0.35 + Math.random() * 0.9,
            size: 1 + Math.random() * 2.2,
            phase: Math.random() * Math.PI * 2,
            charge: Math.random() > 0.5 ? 1 : -1,
          });
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);
    const onMouse = (event: MouseEvent) => pointer.setPointer(event.clientX, event.clientY);
    const onLeave = () => pointer.clearPointer();
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('mouseout', onLeave);

    const draw = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      const progress = scrollRef.current;
      const centerX = width * (0.5 + Math.sin(progress * Math.PI * 2) * 0.08);
      const centerY = height * (0.48 + Math.cos(progress * Math.PI) * 0.08);
      const fieldRadius = Math.min(width, height) * (0.36 + progress * 0.1);

      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, fieldRadius * 1.35);
      glow.addColorStop(0, `rgba(${palette.cyan},0.18)`);
      glow.addColorStop(0.45, `rgba(${palette.blue},0.08)`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (let ring = 0; ring < 5; ring++) {
        const radius = fieldRadius * (0.28 + ring * 0.18);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * (0.34 + ring * 0.08), ring * 0.48 + progress, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring % 2 ? palette.blue : palette.cyan},${0.14 - ring * 0.018})`;
        ctx.lineWidth = ring === 0 ? 1.5 : 1;
        ctx.stroke();
      }

      for (const particle of particles) {
        const angle = particle.phase + time * (particle.charge > 0 ? 0.7 : -0.55) + progress * 5;
        const targetX = centerX + Math.cos(angle) * particle.orbit;
        const targetY = centerY + Math.sin(angle) * particle.orbit * (0.42 + progress * 0.12);
        const dx = targetX - particle.x;
        const dy = targetY - particle.y;
        particle.vx += dx * 0.0009;
        particle.vy += dy * 0.0009;

        if (pointer.hasMoved) {
          const px = particle.x - pointer.x;
          const py = particle.y - pointer.y;
          const distance = Math.hypot(px, py) || 1;
          if (distance < 240) {
            const force = (1 - distance / 240) * 0.22;
            particle.vx += (px / distance) * force;
            particle.vy += (py / distance) * force;
          }
        }

        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -30) particle.x = width + 30;
        if (particle.x > width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = height + 30;
        if (particle.y > height + 30) particle.y = -30;
      }

      ctx.lineWidth = 0.7;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j += 4) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 185) {
            const alpha = (1 - distance / 185) * 0.34;
            ctx.strokeStyle = `rgba(${a.charge === b.charge ? palette.blue : palette.cyan},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const particle of particles) {
        const distance = pointer.hasMoved ? Math.hypot(particle.x - pointer.x, particle.y - pointer.y) : Infinity;
        const charged = Math.max(0, 1 - distance / 230);
        const radius = particle.size + charged * 2.2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = charged > 0.05
          ? `rgba(220,252,255,${0.72 + charged * 0.28})`
          : `rgba(${particle.charge > 0 ? palette.cyan : palette.blue},0.72)`;
        ctx.shadowColor = charged > 0.05 ? '#d8fbff' : '#43e6ff';
        ctx.shadowBlur = 5 + charged * 18;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (pointer.hasMoved) {
        const nearby = particles
          .map((particle) => ({ particle, distance: Math.hypot(particle.x - pointer.x, particle.y - pointer.y) }))
          .filter(({ distance }) => distance < 230)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, lowPerf ? 3 : 6);
        for (const { particle, distance } of nearby) {
          arc(ctx, pointer.x, pointer.y, particle.x, particle.y, 1 - distance / 260, 11);
          // Spawn orange embers at the hit point
          if (Math.random() < 0.25) spawnEmbers(particle.x, particle.y, 1 + Math.floor(Math.random() * 2));
        }
      }

      // Spontaneous orbital discharges keep the atom alive — also spawn embers
      if (!reduced) {
        const a = particles[Math.floor((time * 8) % particles.length)];
        const b = particles[Math.floor((time * 8 + 9) % particles.length)];
        if (a && b && Math.hypot(a.x - b.x, a.y - b.y) < 250) {
          arc(ctx, a.x, a.y, b.x, b.y, 0.42, 7);
          if (Math.random() < 0.15) {
            const hit = Math.random() < 0.5 ? a : b;
            spawnEmbers(hit.x, hit.y, 1);
          }
        }
      }

      // Render + update embers (orange, floating up, decaying)
      embers = embers.filter((e) => e.life < e.max);
      for (const e of embers) {
        e.life++;
        const fade = 1 - e.life / e.max;
        e.x += e.vx;
        e.y += e.vy;
        e.vy -= 0.015; // gentle upward acceleration
        e.vx *= 0.98;
        const r = e.size * fade;
        if (r > 0.1) {
          ctx.beginPath();
          ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${palette.amber},${0.7 * fade})`;
          ctx.shadowColor = `rgba(${palette.amber},0.8)`;
          ctx.shadowBlur = 8 * fade;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [reduced, lowPerf]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
