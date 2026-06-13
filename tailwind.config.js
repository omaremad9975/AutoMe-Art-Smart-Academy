/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'asa-bg': '#FFF8F4',
        'asa-bg-2': '#FFF0E8',
        'asa-surface': '#FFFFFF',
        'asa-surface-2': '#FFF5EF',
        'asa-border': '#FFE4D4',
        'asa-border-subtle': '#F5E6DC',
        'asa-orange': '#FF5C1A',
        'asa-orange-light': '#FF7A40',
        'asa-orange-deep': '#CC3D00',
        'asa-orange-glow': 'rgba(255, 92, 26, 0.12)',
        'asa-orange-glow-strong': 'rgba(255, 92, 26, 0.22)',
        'asa-orange-tint': '#FFF0E8',
        'asa-navy': '#111111',
        'asa-navy-2': '#1C1C1C',
        'asa-text': '#1A1A1A',
        'asa-text-muted': '#6B6B6B',
        'asa-text-faint': '#A0A0A0',
        'asa-white': '#FFFFFF',
      },
      borderRadius: {
        'asa-radius-sm': '8px',
        'asa-radius-md': '14px',
        'asa-radius-lg': '20px',
        'asa-radius-xl': '28px',
        'asa-radius-full': '9999px',
      },
      boxShadow: {
        'asa-shadow-card': '0 4px 24px rgba(255, 92, 26, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'asa-shadow-orange': '0 8px 32px rgba(255, 92, 26, 0.25)',
        'asa-shadow-glow': '0 0 40px rgba(255, 92, 26, 0.15)',
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
