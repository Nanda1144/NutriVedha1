/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Natural & Environmental Healthcare — USER PORTAL ──────────────
        // High-intensity deep/light pairing: deep moss + vivid teal + bright leaf + gold.
        forest: {
          DEFAULT: '#1E5A40', // Intense forest moss
          hover: '#164634',
          dark: '#0F2E22',    // Deep shadow green
          deep: '#0A2018',
          light: '#2E7356',
        },
        teal: {
          DEFAULT: '#0F7A6A', // Vivid natural healthcare teal
          hover: '#0C6356',
          light: '#16A08C',
        },
        mint: {
          DEFAULT: '#5FB05A', // Bright leaf green
          light: '#8FD68A',
          soft: '#E3F2D8',
        },

        surface: {
          base: '#F4F8EC',
          card: '#FFFFFF',
          highlight: '#E3F2D8',
          border: '#D7E6C9',
        },
        ink: {
          DEFAULT: '#14231C',
          muted: '#5A6E61',
        },

        state: {
          success: '#2FA45F',
          warning: '#E39A24',
          error: '#D1443C',
        },

        chart: {
          forest: '#1E5A40',
          teal: '#0F7A6A',
          mint: '#5FB05A',
          blue: '#4F8FB3',
          orange: '#E39A24',
        },

        // Legacy aliases mapped onto the natural palette
        ivory: '#F4F8EC',
        cream: '#E3F2D8',
        'soft-beige': '#D7E6C9',
        sand: '#E0B45C', // high-intensity warm earth accent
        sage: '#A6C79C',
        olive: '#3E7A32',
        'warm-brown': '#5A6E61',
        charcoal: '#14231C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        sm: ['0.9375rem', { lineHeight: '1.5rem' }],    // 15px
        base: ['1.0625rem', { lineHeight: '1.65rem' }], // 17px
        lg: ['1.1875rem', { lineHeight: '1.8rem' }],    // 19px
        xl: ['1.3125rem', { lineHeight: '1.9rem' }],    // 21px
        '2xl': ['1.5625rem', { lineHeight: '2.1rem' }], // 25px
        '3xl': ['1.9375rem', { lineHeight: '2.4rem' }], // 31px
        '4xl': ['2.3125rem', { lineHeight: '2.7rem' }], // 37px
      },
      backgroundImage: {
        'gradient-hero':
          'radial-gradient(circle at 82% 12%, rgba(95,176,90,0.38), transparent 46%), linear-gradient(135deg, #0F2E22 0%, #1E5A40 55%, #0F7A6A 100%)',
        'gradient-brand': 'linear-gradient(135deg, #1E5A40 0%, #0F7A6A 100%)',
        'gradient-brand-dark':
          'linear-gradient(135deg, #0A2018 0%, #0F2E22 45%, #1E5A40 100%)',
        'gradient-leaf': 'linear-gradient(135deg, #1E5A40 0%, #5FB05A 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0F7A6A 0%, #16A08C 100%)',
        'gradient-sun': 'linear-gradient(135deg, #E0B45C 0%, #C98E2E 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFFFF 0%, #F1F7E9 100%)',
        'gradient-light': 'linear-gradient(135deg, #F4F8EC 0%, #E3F2D8 100%)',
        'gradient-sheen':
          'radial-gradient(circle at 25% 15%, rgba(255,255,255,0.28), transparent 55%)',
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        'earth-sm': '0 1px 2px rgba(15, 46, 34, 0.08)',
        'earth-md': '0 8px 20px rgba(15, 46, 34, 0.14)',
        'earth-lg': '0 18px 42px rgba(15, 46, 34, 0.20)',
        'glow-leaf': '0 0 0 1px rgba(95,176,90,0.22), 0 10px 30px rgba(15,122,106,0.22)',
        'glow-teal': '0 10px 30px rgba(15,122,106,0.28)',
      },
    },
  },
  plugins: [],
}
