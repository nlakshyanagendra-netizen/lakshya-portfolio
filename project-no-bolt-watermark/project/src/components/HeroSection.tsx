import { Github, Linkedin, ArrowDown, Sparkles } from 'lucide-react';
import { site } from '@/config/site';
import { scrollToId } from '@/lib/scroll';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-center pt-20">
        <p className="t-label t-label-center justify-center animate-fade-in">
          <Sparkles size={12} /> {site.heroLabel}
        </p>

        <h1
          className="mt-6 font-display font-semibold tracking-tight glow-soft animate-fade-up"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 8.5rem)', letterSpacing: '-0.04em' }}
        >
          {site.shortName.toUpperCase()}
        </h1>

        <p className="mt-4 mono text-xs sm:text-sm text-cyan tracking-[0.25em] animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {site.tagline.toUpperCase()}
        </p>

        <p
          className="mt-10 max-w-2xl mx-auto text-balance text-fg-bright text-xl sm:text-3xl font-display font-medium leading-snug animate-fade-up"
          style={{ animationDelay: '0.18s' }}
        >
          &ldquo;{site.heroHeadline}&rdquo;
        </p>

        <p
          className="mt-6 max-w-xl mx-auto text-fg-muted text-base leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.26s' }}
        >
          {site.heroSub}
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.34s' }}
        >
          <button onClick={() => scrollToId('projects')} className="btn btn-primary">
            Explore Projects
          </button>
          <button onClick={() => scrollToId('contact')} className="btn btn-ghost">
            Contact Me
          </button>
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.42s' }}
        >
          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full border border-line text-fg-muted hover:text-cyan hover:border-cyan/50 transition-colors"
            aria-label="GitHub profile"
          >
            <Github size={18} />
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full border border-line text-fg-muted hover:text-cyan hover:border-cyan/50 transition-colors"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      <button
        onClick={() => scrollToId('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-dim hover:text-cyan transition-colors"
        aria-label="Scroll to about"
      >
        <span className="mono text-[0.6rem] tracking-[0.3em]">SCROLL</span>
        <span className="relative w-5 h-9 border border-line rounded-full flex items-start justify-center pt-1.5">
          <span className="w-1 h-1.5 rounded-full bg-cyan scroll-down" />
        </span>
        <ArrowDown size={14} className="-mt-1" />
      </button>
    </section>
  );
}
