import { useEffect, useState, useCallback, useRef } from 'react';

/** True when the user prefers reduced motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/** Page scroll progress 0..1. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}

/** Currently in-view section id from a list of ids. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** A boolean stored in localStorage, SSR-safe. */
export function useStoredState(key: string, initial: boolean) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) === '1' ? true : initial;
    } catch {
      return initial;
    }
  });
  const set = useCallback((v: boolean) => {
    setValue(v);
    try {
      localStorage.setItem(key, v ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [key]);
  return [value, set] as const;
}

/** Coarse device capability flag (low-power mobile vs. desktop). */
export function useLowPerf() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const cores = (navigator as any).hardwareConcurrency || 4;
    const mem = (navigator as any).deviceMemory || 4;
    setLow(isMobile || cores <= 4 || mem <= 4);
  }, []);
  return low;
}

/** Tracks whether the pointer is hovering an element, returns handlers + ref. */
export function useHover() {
  const ref = useRef<HTMLElement | null>(null);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setHover(true);
    const off = () => setHover(false);
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    return () => {
      el.removeEventListener('mouseenter', on);
      el.removeEventListener('mouseleave', off);
    };
  }, []);
  return { ref, hover };
}
