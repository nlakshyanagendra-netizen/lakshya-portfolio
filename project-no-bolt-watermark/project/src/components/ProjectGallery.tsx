import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X, ShieldAlert, ExternalLink, FileText } from 'lucide-react';
import { projects, type Category, type Project } from '@/config/site';
import ProjectVisual from './ProjectVisual';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

const filters: (Category | 'All')[] = [
  'All', 'Electrical Engineering', 'Experimental Physics', 'AI', 'Computer Vision', 'Software', 'Robotics',
];

export default function ProjectGallery({ highlightId }: { highlightId?: string | null }) {
  const [active, setActive] = useState<Category | 'All'>('All');
  const [open, setOpen] = useState<Project | null>(null);
  const reduced = usePrefersReducedMotion();

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.categories.includes(active))),
    [active]
  );

  return (
    <section id="projects" className="section">
      <p className="t-label">02 · Featured Work</p>
      <h2 className="section-title">Experiments that built something.</h2>
      <p className="section-sub">
        Each project below is something I have actually run or am actively working on. Click a card for the technical write-up.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs mono border transition-all',
              active === f
                ? 'bg-cyan/10 border-cyan text-cyan'
                : 'border-line text-fg-muted hover:text-fg hover:border-line-strong'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setOpen(p)}
            className={cn(
              'group text-left panel frame overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40',
              reduced ? '' : 'animate-fade-up',
              highlightId === p.id && 'ring-2 ring-cyan ring-offset-2 ring-offset-base'
            )}
            style={{ animationDelay: `${0.05 * i}s` }}
            aria-label={`Open ${p.title}`}
          >
            <div className="h-44">
              <ProjectVisual project={p} className="w-full h-full" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="mono text-xs text-fg-dim">{p.number}</span>
                  <h3 className="mt-1 text-lg font-display font-semibold text-fg-bright group-hover:text-cyan transition-colors">
                    {p.title}
                  </h3>
                </div>
                <ArrowUpRight size={16} className="text-fg-dim group-hover:text-cyan transition-colors shrink-0 mt-1" />
              </div>
              <p className="mt-2 text-sm text-fg-muted line-clamp-2">{p.short}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.categories.map((c) => (
                  <span key={c} className="tag">{c}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {open && createPortal(<CaseStudy project={open} onClose={() => setOpen(null)} />, document.body)}
    </section>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-3xl panel frame flex flex-col max-h-[85dvh] sm:max-h-[90dvh] overflow-hidden rounded-b-none sm:rounded-[18px] animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-line bg-black/70 backdrop-blur-md text-fg-bright shadow-lg hover:text-cyan hover:border-cyan/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="h-56 sm:h-72">
          <ProjectVisual project={project} className="w-full h-full" />
        </div>

        <div className="p-6 sm:p-8">
          <span className="mono text-xs text-fg-dim">PROJECT {project.number}</span>
          <h3 className="mt-1 text-2xl sm:text-3xl font-display font-semibold text-fg-bright">
            {project.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.categories.map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>

          <p className="mt-5 text-fg text-lg leading-relaxed">{project.description}</p>

          <h4 className="mt-7 t-label">Technical notes</h4>
          <p className="mt-2 text-fg-muted leading-relaxed">{project.technical}</p>

          {project.safetyNote && (
            <div className="mt-5 panel px-4 py-3 flex gap-3 items-start border-amber/30">
              <ShieldAlert size={16} className="text-amber shrink-0 mt-0.5" />
              <p className="text-sm text-fg-muted">{project.safetyNote}</p>
            </div>
          )}


          <div className="mt-5 flex flex-wrap gap-3">
            {project.links?.source && (
              <a href={project.links.source} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
                <ExternalLink size={14} /> Source code
              </a>
            )}
            {project.links?.docs && (
              <a href={project.links.docs} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
                <FileText size={14} /> Documentation
              </a>
            )}

          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
