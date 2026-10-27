import { useEffect, useState } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectGallery from '@/components/ProjectGallery';
import SkillsSection from '@/components/SkillsSection';
import AchievementTimeline from '@/components/AchievementTimeline';
import ElectricFieldExplorer from '@/components/ElectricFieldExplorer';
import ContactSection from '@/components/ContactSection';
import ScrollReactiveBackground from '@/components/ScrollReactiveBackground';
import EdgePet from '@/components/EdgePet';
import MusicPlayer from '@/components/MusicPlayer';
import CommandPalette from '@/components/CommandPalette';
import EnterScreen from '@/components/EnterScreen';

function Portfolio() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  // Command palette keybinding: Ctrl+K / Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <ScrollReactiveBackground />

      <Navbar onOpenPalette={() => setPaletteOpen(true)} />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectGallery highlightId={highlightedProject} />
        <SkillsSection
          highlightedProject={highlightedProject}
          setHighlightedProject={setHighlightedProject}
        />
        <AchievementTimeline />
        <ElectricFieldExplorer />
        <ContactSection />
      </main>

      <footer className="relative z-10 border-t border-line mt-10">
        <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-dim">
          <span className="mono">
            © {new Date().getFullYear()} Lakshya Nagendra Nakka · Built with React, Vite & Canvas
          </span>
          <span className="mono">Press ⌘K / Ctrl+K for shortcuts</span>
        </div>
      </footer>

      <EdgePet />
      <MusicPlayer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {!entered && <EnterScreen onDone={() => setEntered(true)} />}
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Portfolio />
    </SettingsProvider>
  );
}
