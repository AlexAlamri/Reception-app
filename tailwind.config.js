/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF',
        'surface-hover': '#F5F4F1',
        elevated: '#FFFFFF',
        triage: {
          red:     { light: '#FFF0F0', DEFAULT: '#E8A0A0', dark: '#C75050', text: '#9B2C2C' },
          amber:   { light: '#FFF5EB', DEFAULT: '#F0C8A0', dark: '#D4943C', text: '#92400E' },
          purple:  { light: '#F5F0FF', DEFAULT: '#C4B0E8', dark: '#7C5CB8', text: '#553C7B' },
          yellow:  { light: '#FFFDE8', DEFAULT: '#E8D888', dark: '#C4A820', text: '#78600C' },
          green:   { light: '#F0F8F0', DEFAULT: '#A0D0A0', dark: '#508050', text: '#276749' },
          blue:    { light: '#F0F4FF', DEFAULT: '#A0B8E0', dark: '#4070B0', text: '#2A4A7F' },
          teal:    { light: '#F0F8F8', DEFAULT: '#A0D0D0', dark: '#408080', text: '#285E61' },
          grey:    { light: '#F8F7F4', DEFAULT: '#E8E6E0', dark: '#A8A4A0', text: '#4A4540' },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderColor: {
        subtle: '#E8E6E0',
        'subtle-hover': '#D0CEC8',
      },
    },
  },
  plugins: [],
}
