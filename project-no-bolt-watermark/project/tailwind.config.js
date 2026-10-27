/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#03050c',
        deep: '#050811',
        panel: '#0a0f1c',
        panel2: '#0d1424',
        'fg-bright': '#f3f7ff',
        fg: '#d8e0f0',
        'fg-muted': '#8a94ad',
        'fg-dim': '#5b6478',
        cyan: {
          DEFAULT: '#43e6ff',
          bright: '#8bf1ff',
          deep: '#0e7d96',
        },
        blue: {
          DEFAULT: '#4a8dff',
          bright: '#8fb4ff',
          deep: '#1e3a7a',
        },
        uv: {
          DEFAULT: '#b07bff',
          deep: '#5a2dbd',
        },
        amber: {
          DEFAULT: '#ffb454',
          bright: '#ffcc7a',
        },
        line: 'rgba(140, 170, 220, 0.12)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '460px',
      },
    },
  },
  plugins: [],
};
