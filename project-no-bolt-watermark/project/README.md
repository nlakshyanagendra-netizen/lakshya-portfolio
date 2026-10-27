# Lakshya Nagendra Nakka — Interactive Engineering Portfolio

A cinematic, single-page portfolio for an electrical engineering student at NIT
Tiruchirappalli. Built around the idea of turning physical phenomena into things
that actually work — Tesla coils, particle levitation, computer vision, and
robotics — inside a living, scroll-reactive electromagnetic background.

## Stack

- **React 18 + TypeScript** — components and types throughout
- **Vite 7** — dev server and production build
- **Tailwind CSS** — utility styling driven by a custom design system
- **Canvas 2D + SVG** — all visual effects (no WebGL, no heavy animation libraries)
- **Web Audio API** — original chime for the edge-dwelling pet (no audio files)
- **YouTube IFrame API** — fixed owner-configured music reference

No paid APIs, no analytics, no tracking, no backend required for the core site.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run typecheck # type-check without emitting
```

## Project structure

```
src/
  config/site.ts            # ← EDIT EVERYTHING HERE: info, links, projects, music
  context/SettingsContext.tsx # sound + pet visibility + chime provider
  hooks/index.ts            # reduced-motion, scroll progress, active section, etc.
  lib/                      # small utilities (cn, clamp, scrollToId)
  components/
    ScrollReactiveBackground.tsx  # fixed Canvas background, mood per section
    HeroSection.tsx
    AboutSection.tsx
    ProjectGallery.tsx       # filters + case-study overlays
    ProjectVisual.tsx        # per-project SVG/Canvas illustrations
    SkillsSection.tsx        # click a skill → highlights related projects
    AchievementTimeline.tsx
    ElectricFieldExplorer.tsx # interactive charge sandbox
    EdgePet.tsx              # peeking mascot + chime
    MusicPlayer.tsx          # fixed YouTube embed, silent by default
    ContactSection.tsx       # validated form, honeypot, honest fallback
    CommandPalette.tsx       # Ctrl/Cmd+K
    Navbar.tsx
```

## Editing your content

Almost everything you'd want to change lives in **`src/config/site.ts`**:

- `site.name`, `site.shortName`, `site.tagline`, `site.institution`
- `site.socials.github`, `site.socials.linkedin`
- `site.email` — leave empty to show a placeholder; set it to enable the email fallback
- `site.contactEndpoint` — set to a form endpoint (Formspree, a Supabase Edge
  Function, etc.) to enable real form submission. Leave empty to show an honest
  "not configured yet" note instead of faking success.
- `site.youtubeId` — the fixed music reference (YouTube video ID only; the player
  never offers a track-selection UI)
- `projects` — each project's title, description, technical notes, categories,
  safety note, and optional `links.source` / `links.docs`. Per-project media
  (photo/diagram/video URLs) are placeholders ready for you to fill in.
- `achievements` — timeline entries; the Mekathlon link points at the official site
- `skillGroups` — three groups; each skill lists its related project IDs

## Music configuration

The player uses the YouTube IFrame API with the video ID in `site.youtubeId`
(`MQcSxra6XvE` by default). It is **silent by default** and only loads once the
visitor explicitly enables sound — no autoplay before interaction.

Important notes (per the brief):

- The site does **not** download or redistribute YouTube audio.
- It uses an **official YouTube embed**. YouTube's own player controls may allow
  visitors to interact with the embedded player beyond the configured track.
- The site cannot fully restrict YouTube's internal controls.
- If you need strict single-track control, host your own licensed audio file and
  swap `MusicPlayer.tsx` for an `<audio>` element — the config already isolates
  the reference URL.

## Contact form activation

The form in `ContactSection.tsx` validates name, email, subject, and message,
includes a hidden honeypot field for anti-spam, and posts JSON to
`site.contactEndpoint` if set.

- **With an endpoint:** set `site.contactEndpoint` to your form service URL
  (e.g. `https://formspree.io/f/xxxx`). On success it shows a real confirmation.
- **Without an endpoint:** it does **not** fake success. It shows a clear note
  explaining submission isn't wired up, and offers an "Open in email app"
  fallback once `site.email` is set.

Keep any service credentials in server-side environment variables — never commit
them to the repo.

## Accessibility & performance

- Full keyboard navigation; the command palette is `Ctrl+K` / `Cmd+K`.
- `prefers-reduced-motion` is respected everywhere — canvases render static
  frames, the pet stops its animation loop, and CSS animations are neutralized.
- Particle counts and animation quality adapt to device capability
  (`hardwareConcurrency` / `deviceMemory` / mobile UA).
- The background canvas is fixed, behind content, and `pointer-events: none`,
  so it never blocks clicks.
- Color contrast follows the bright-on-dark system defined in `index.css`.

## Deployment (Cloudflare Pages, free)

1. Push the repo to GitHub.
2. In Cloudflare Pages, create a new project from the GitHub repo.
3. Use these settings (confirm against your `vite.config.ts`):
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node version:** 18 or 20
4. Deploy. Cloudflare gives you a `*.pages.dev` URL automatically.
5. (Optional) Add a custom domain in Cloudflare Pages → Custom domains. If you
   have a GitHub Student Developer Pack domain benefit, point its DNS at
   Cloudflare and add it here.

The core site works with no environment variables. Only set secrets if you wire
up a contact-form endpoint that needs them.

## Easter egg

Double-click the edge-dwelling pet to trigger its hidden response — and try the
command palette (`Ctrl+K` / `Cmd+K`) for quick navigation.

## Notes on testing

- Production build and TypeScript type-check both pass.
- Browser-only checks (console errors, live YouTube playback, touchscreen
  gestures) should be run in a real browser before launch. The dev server
  (`npm run dev`) is the fastest way to do that.
- Social links (GitHub, LinkedIn, Mekathlon) are verified against the URLs in
  the brief. Add your email in `site.ts` to enable the email fallback.
