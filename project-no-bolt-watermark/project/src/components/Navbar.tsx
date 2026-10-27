import { useEffect, useState } from 'react';
import { Github, Linkedin, Command as CommandIcon, Menu, X } from 'lucide-react';
import { site } from '@/config/site';
import { useActiveSection, useScrollProgress } from '@/hooks';
import { scrollToId } from '@/lib/scroll';
import { cn } from '@/lib/utils';

export default function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progress = useScrollProgress();
  const active = useActiveSection(['home', ...site.sections.map((s) => s.id)]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-deep/85 backdrop-blur-xl border-b border-line' : 'bg-transparent'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-16 flex items-center justify-between">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 group"
          aria-label="Back to top"
        >
          <span className="relative w-7 h-7">
            <span className="absolute inset-0 rounded-full border border-cyan/60" />
            <span className="absolute inset-1.5 rounded-full bg-cyan/80 group-hover:bg-cyan transition-colors" />
          </span>
          <span className="font-display font-semibold text-fg-bright tracking-tight">
            {site.shortName}
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {site.sections.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={cn(
                'px-3 py-2 text-sm rounded-full transition-colors',
                active === s.id ? 'text-cyan' : 'text-fg-muted hover:text-fg'
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-line text-xs text-fg-muted hover:text-cyan hover:border-cyan/50 transition-colors"
            aria-label="Open command palette"
          >
            <CommandIcon size={12} />
            <span>K</span>
          </button>

          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full border border-line text-fg-muted hover:text-cyan hover:border-cyan/50 transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full border border-line text-fg-muted hover:text-cyan hover:border-cyan/50 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 rounded-full border border-line text-fg"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-deep/95 backdrop-blur-xl',
          open ? 'max-h-80 border-b border-line' : 'max-h-0'
        )}
      >
        <nav className="px-5 py-4 flex flex-col gap-1">
          {site.sections.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={cn(
                'text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                active === s.id ? 'text-cyan bg-cyan/5' : 'text-fg-muted'
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div
          className="h-full bg-gradient-to-r from-cyan to-blue"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  );
}
