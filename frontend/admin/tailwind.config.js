/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Admin Dashboard — legacy palette ──────────────────────────────
        // Emerald primary, indigo accent, red error, white cards.
        // Primary / brand
        forest: {
          DEFAULT: '#10B981', // Emerald primary (legacy toast/primary)
          hover: '#059669', // Emerald 600
          dark: '#047857', // Emerald 700
          light: '#34D399', // Emerald 400
        },
        teal: {
          DEFAULT: '#6366F1', // Indigo accent (rgba(99,102,241))
          hover: '#4F46E5', // Indigo 600
          light: '#818CF8', // Indigo 400
        },
        mint: {
          DEFAULT: '#34D399', // Emerald 400 accent
          light: '#6EE7B7', // Emerald 300
          soft: '#D1FAE5', // Emerald 100
        },

        // Semantic surface + text tokens
        surface: {
          base: '#F8FAFC', // Main Background (slate 50)
          card: '#FFFFFF', // Card Background
          highlight: '#ECFDF5', // Highlight Background (emerald 50)
          border: '#E2E8F0', // Border (slate 200)
        },
        ink: {
          DEFAULT: '#0F172A', // Primary Text (slate 900)
          muted: '#64748B', // Secondary Text (slate 500)
        },

        // Status
        state: {
          success: '#10B981', // Emerald 500
          warning: '#F59E0B', // Amber 500
          error: '#EF4444', // Red 500 (legacy error)
        },

        // Data-visualisation palette
        chart: {
          forest: '#10B981',
          teal: '#6366F1',
          mint: '#34D399',
          blue: '#0EA5E9',
          orange: '#F59E0B',
        },

        // ── Legacy aliases mapped onto the new palette ────────────────────
        // Keeps every existing page/component consistent without rewrites.
        ivory: '#F8FAFC',
        cream: '#ECFDF5',
        'soft-beige': '#E2E8F0',
        sand: '#34D399',
        sage: '#6EE7B7',
        olive: '#6366F1',
        'warm-brown': '#64748B',
        charcoal: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        // Legacy `font-serif` headings now use the premium modern display face.
        serif: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        'earth-sm': '0 1px 2px rgba(15, 23, 42, 0.05)',
        'earth-md': '0 6px 16px rgba(16, 185, 129, 0.08)',
        'earth-lg': '0 14px 34px rgba(16, 185, 129, 0.12)',
      },
    },
  },
  plugins: [],
}
