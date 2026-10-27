import { useEffect, useRef, useState } from 'react';
import { Folder, Cpu, Trophy, Mail, Volume2, VolumeX, ArrowUp, Search, FlaskConical, X } from 'lucide-react';
import { site } from '@/config/site';
import { useSettings } from '@/context/SettingsContext';
import { scrollToId } from '@/lib/scroll';
import { cn } from '@/lib/utils';

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Folder;
  action: () => void;
};

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { soundEnabled, toggleSound } = useSettings();
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands: Command[] = [
    { id: 'projects', label: 'Go to Projects', icon: Folder, action: () => scrollToId('projects') },
    { id: 'skills', label: 'Go to Skills', icon: Cpu, action: () => scrollToId('skills') },
    { id: 'achievements', label: 'Open Achievements', icon: Trophy, action: () => scrollToId('achievements') },
    { id: 'lab', label: 'Open Field Explorer', icon: FlaskConical, action: () => scrollToId('lab') },
    { id: 'contact', label: 'Go to Contact', icon: Mail, action: () => scrollToId('contact') },
    {
      id: 'sound',
      label: soundEnabled ? 'Mute sound' : 'Enable sound',
      icon: soundEnabled ? VolumeX : Volume2,
      action: toggleSound,
    },
    { id: 'top', label: 'Return to top', icon: ArrowUp, action: () => scrollToId('home') },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[highlight];
        if (cmd) {
          cmd.action();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, highlight, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg panel frame animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
          <Search size={16} className="text-fg-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            className="flex-1 bg-transparent outline-none text-fg-bright placeholder:text-fg-dim text-sm"
            aria-label="Command search"
          />
          <button
            onClick={onClose}
            className="text-fg-dim hover:text-fg"
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-fg-dim">No commands found.</li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                onClick={() => {
                  c.action();
                  onClose();
                }}
                onMouseEnter={() => setHighlight(i)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                  i === highlight ? 'bg-cyan/10 text-cyan' : 'text-fg hover:bg-white/5'
                )}
              >
                <c.icon size={16} />
                <span className="text-sm flex-1">{c.label}</span>
                {c.id === 'sound' && (
                  <span className="text-xs text-fg-dim mono">
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2.5 border-t border-line flex items-center justify-between text-[0.7rem] text-fg-dim mono">
          <span>↑↓ navigate · ↵ select · esc close</span>
          <span>{site.shortName.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
