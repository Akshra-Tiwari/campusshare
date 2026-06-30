/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory:   { DEFAULT: '#EDE8D0', light: '#F5F2E8', dark: '#DDD8C0' },
        olive:   { DEFAULT: '#6E632E', light: '#8A7D3A', dark: '#4E4520', muted: '#9A8F5A' },
        lavender:{ DEFAULT: '#DBD1ED', light: '#EDE8F6', dark: '#C9BDE0' },
        pastel:  { DEFAULT: '#ABBEED', light: '#C8D8F5', dark: '#8AAADE' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 4px rgba(110,99,46,0.06), 0 4px 16px rgba(110,99,46,0.04)',
        'card-md': '0 4px 20px rgba(110,99,46,0.10), 0 1px 4px rgba(110,99,46,0.06)',
        'card-lg': '0 8px 40px rgba(110,99,46,0.14), 0 2px 8px rgba(110,99,46,0.06)',
        'btn':     '0 2px 8px rgba(110,99,46,0.25), 0 1px 2px rgba(110,99,46,0.15)',
        'btn-lg':  '0 4px 16px rgba(110,99,46,0.30), 0 2px 4px rgba(110,99,46,0.15)',
        'glow':    '0 0 40px rgba(171,190,237,0.35), 0 0 80px rgba(219,209,237,0.20)',
        'olive':   '0 4px 20px rgba(110,99,46,0.30)',
      },
      backgroundImage: {
        // Base canvas — warm ivory with cool depth
        'canvas':        'linear-gradient(135deg, #F0EBD8 0%, #EDE8D0 30%, #E8E3D8 50%, #EDE8D0 70%, #EAE6D5 100%)',
        // Hero — ivory base with lavender and pastel blends
        'hero':          'radial-gradient(ellipse 120% 80% at 70% 20%, #C8D8F5 0%, #DBD1ED 25%, #EDE8D0 55%, #F0EBD8 100%)',
        // Section alternates
        'section-a':     'linear-gradient(160deg, #EDE8D0 0%, #E8E3DA 40%, #EDE0F0 70%, #EDE8D0 100%)',
        'section-b':     'linear-gradient(200deg, #F0EBD8 0%, #DBD1ED 0%, #EDE8D0 40%, #D8E4F5 80%, #EDE8D0 100%)',
        'section-b-safe':'linear-gradient(200deg, #EDE8D0 0%, #E8DEFF 30%, #EDE8D0 60%, #D8E4F5 90%, #EDE8D0 100%)',
        // Cards
        'card-glass':    'linear-gradient(135deg, rgba(237,232,208,0.85) 0%, rgba(255,255,255,0.65) 100%)',
        'card-lavender': 'linear-gradient(135deg, rgba(219,209,237,0.5) 0%, rgba(237,232,208,0.8) 100%)',
        'card-pastel':   'linear-gradient(135deg, rgba(171,190,237,0.4) 0%, rgba(237,232,208,0.85) 100%)',
        // Navbar
        'nav':           'linear-gradient(180deg, rgba(237,232,208,0.97) 0%, rgba(240,235,220,0.95) 100%)',
        // CTA
        'cta':           'linear-gradient(135deg, #6E632E 0%, #8A7D3A 35%, #6E632E 65%, #4E4520 100%)',
        // Olive button
        'btn-olive':     'linear-gradient(135deg, #7A6F35 0%, #6E632E 50%, #5A5228 100%)',
        // Footer
        'footer':        'linear-gradient(180deg, #EDE8D0 0%, #DDD8C0 40%, #CCC6A8 100%)',
      },
      backdropBlur: { xs: '2px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite reverse',
        'pulse-soft':   'pulseSoft 4s ease-in-out infinite',
        'fade-up':      'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':      'fadeIn 0.5s ease-out both',
        'scale-in':     'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':      'shimmer 2s linear infinite',
        'slide-right':  'slideRight 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'blob-drift':   'blobDrift 12s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':     { transform: 'translateY(-12px) rotate(1deg)' },
          '66%':     { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.05)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blobDrift: {
          '0%':   { transform: 'translate(0,0) scale(1)' },
          '33%':  { transform: 'translate(30px,-20px) scale(1.08)' },
          '66%':  { transform: 'translate(-20px,15px) scale(0.95)' },
          '100%': { transform: 'translate(10px,-5px) scale(1.03)' },
        },
      },
      transitionTimingFunction: {
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth':  'cubic-bezier(0.22, 1, 0.36, 1)',
        'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}
