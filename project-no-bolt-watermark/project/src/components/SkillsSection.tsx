import { useState } from 'react';
import { Zap, Code2, Cpu } from 'lucide-react';
import { skillGroups, projects } from '@/config/site';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Zap> = { Zap, Code2, Cpu };

export default function SkillsSection({
  highlightedProject,
  setHighlightedProject,
}: {
  highlightedProject: string | null;
  setHighlightedProject: (v: string | null) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  const relatedProjects = active
    ? skillGroups
        .flatMap((g) => g.skills)
        .find((s) => s.name === active)?.relatedProjects ?? []
    : [];

  return (
    <section id="skills" className="section">
      <p className="t-label">03 · Skills</p>
      <h2 className="section-title">What I work with.</h2>
      <p className="section-sub">
        Click any skill to highlight the projects that use it. No invented ratings — this is a map of what shows up across the work.
      </p>

      <div className="mt-10 grid lg:grid-cols-3 gap-5">
        {skillGroups.map((g, gi) => {
          const Icon = iconMap[g.icon] ?? Zap;
          return (
            <div
              key={g.id}
              className={cn('panel frame p-6', reduced ? '' : 'animate-fade-up')}
              style={{ animationDelay: `${gi * 0.08}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                  <Icon size={18} />
                </span>
                <h3 className="text-base font-display font-semibold text-fg-bright">{g.title}</h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setActive((a) => (a === s.name ? null : s.name))}
                    onMouseEnter={() => setHighlightedProject(s.relatedProjects[0] ?? null)}
                    onMouseLeave={() => setHighlightedProject(null)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs border transition-all',
                      active === s.name
                        ? 'bg-cyan/15 border-cyan text-cyan'
                        : 'border-line text-fg-muted hover:text-fg hover:border-line-strong'
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {active && (
        <div className="mt-8 panel p-5 animate-fade-in">
          <p className="t-label">Related projects</p>
          {relatedProjects.length === 0 ? (
            <p className="mt-2 text-sm text-fg-muted">No linked projects yet.</p>
          ) : (
            <ul className="mt-3 grid sm:grid-cols-2 gap-3">
              {relatedProjects
                .map((id) => projects.find((p) => p.id === id))
                .filter(Boolean)
                .map((p) => (
                  <li key={p!.id} className="flex items-start gap-3 text-sm">
                    <span className="mono text-cyan">{p!.number}</span>
                    <div>
                      <p className="text-fg-bright">{p!.title}</p>
                      <p className="text-fg-muted">{p!.short}</p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
