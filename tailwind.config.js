/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: 'rgba(255,255,255,0.03)',
        'surface-hover': 'rgba(255,255,255,0.06)',
        elevated: 'rgba(255,255,255,0.05)',
        'triage-red': '#FF3B5C',
        'triage-amber': '#FF9F1C',
        'triage-green': '#22C55E',
        'triage-blue': '#6C8EFF',
        'triage-teal': '#4ECDC4',
        'triage-violet': '#A78BFA',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.06)',
        'subtle-hover': 'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [],
}
