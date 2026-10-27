import { Atom, Waves, Cpu, CircuitBoard, Wind, Bot, Code2, Zap } from 'lucide-react';
import { site } from '@/config/site';
import { usePrefersReducedMotion } from '@/hooks';

const interests = [
  { icon: Zap, label: 'High-voltage experiments' },
  { icon: CircuitBoard, label: 'Tesla coils & electrical discharges' },
  { icon: Atom, label: 'Electrostatics & particle levitation' },
  { icon: Waves, label: 'Ultrasonic particle levitation' },
  { icon: Code2, label: 'Python & computer vision' },
  { icon: Cpu, label: 'AI-assisted software development' },
  { icon: Bot, label: 'Robotics, pathfinding & control' },
  { icon: Wind, label: 'Energy recovery & experimental engineering' },
];

export default function AboutSection() {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="about" className="section">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
        <div>
          <p className="t-label">01 · About</p>
          <h2 className="section-title">{site.about.heading}</h2>
          <div className="space-y-5 mt-8">
            {site.about.body.map((para, i) => (
              <p
                key={i}
                className={reduced ? 'text-fg text-lg leading-relaxed' : 'animate-fade-up text-fg text-lg leading-relaxed'}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="t-label">Interests</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {interests.map((it, i) => (
              <div
                key={it.label}
                className={reduced ? 'panel frame px-4 py-4 flex items-center gap-3' : 'panel frame px-4 py-4 flex items-center gap-3 animate-fade-up'}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span className="w-9 h-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0">
                  <it.icon size={16} />
                </span>
                <span className="text-sm text-fg">{it.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 panel px-5 py-4 flex items-center gap-3 text-sm text-fg-muted">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-soft" />
            Currently at {site.institution} · {site.role}
          </div>
        </div>
      </div>
    </section>
  );
}
