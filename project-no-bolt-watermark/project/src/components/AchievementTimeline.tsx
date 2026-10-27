import { Trophy, FlaskConical, HeartHandshake, Users, ExternalLink } from 'lucide-react';
import { achievements } from '@/config/site';
import { usePrefersReducedMotion } from '@/hooks';

const iconMap: Record<string, typeof Trophy> = {
  Trophy,
  FlaskConical,
  HeartHandshake,
  Users,
};

export default function AchievementTimeline() {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="achievements" className="section">
      <p className="t-label">04 · Achievements & Leadership</p>
      <h2 className="section-title">Beyond the workbench.</h2>
      <p className="section-sub">
        A short, honest record of the things outside the lab — competition, school responsibility, and community work.
      </p>

      <div className="mt-12 relative">
        {/* vertical line */}
        <div
          className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(67,230,255,0.5) 8%, rgba(67,230,255,0.5) 92%, transparent 100%)',
            boxShadow: '0 0 12px rgba(67,230,255,0.4)',
          }}
        />

        <div className="space-y-10">
          {achievements.map((a, i) => {
            const Icon = iconMap[a.icon] ?? Trophy;
            const left = i % 2 === 0;
            return (
              <div
                key={a.id}
                className={`relative flex ${left ? 'sm:justify-start' : 'sm:justify-end'}`}
              >
                {/* node */}
                <span
                  className={`absolute left-4 sm:left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-cyan bg-base z-10 ${
                    reduced ? '' : 'animate-pulse-soft'
                  }`}
                />
                <div
                  className={`pl-12 sm:pl-0 sm:w-[44%] ${left ? 'sm:pr-10 sm:text-right' : 'sm:pl-10'}`}
                >
                  <div className="panel frame p-5">
                    <div className={`flex items-center gap-3 ${left ? 'sm:flex-row-reverse' : ''}`}>
                      <span className="w-9 h-9 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center text-amber shrink-0">
                        <Icon size={16} />
                      </span>
                      <h3 className="text-fg-bright font-display font-semibold">{a.title}</h3>
                    </div>
                    <p className={`mt-3 text-sm text-fg-muted ${left ? 'sm:text-right' : ''}`}>{a.body}</p>
                    {a.link && (
                      <a
                        href={a.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs text-cyan link-underline ${left ? 'sm:flex-row-reverse' : ''}`}
                      >
                        {a.link.label} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
