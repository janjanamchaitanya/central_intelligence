/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Trust Blue
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          400: '#60A5FA',
          600: '#1455A8',
          800: '#1E3A8A',
        },
        // Neutral - Slate
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        // Semantic colors
        success: {
          DEFAULT: '#059669',
          bg: '#D1FAE5',
          fg: '#059669',
        },
        warning: {
          DEFAULT: '#D97706',
          bg: '#FEF3C7',
          fg: '#D97706',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg: '#FEE2E2',
          fg: '#DC2626',
        },
        info: {
          DEFAULT: '#1455A8',
          bg: '#EBF3FD',
          fg: '#1455A8',
        },
        // Debit/Credit
        debit: '#DC2626',
        credit: '#059669',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Type scale from design system
        'display-xl': ['36px', { lineHeight: '1.1', letterSpacing: '-0.5px', fontWeight: '500' }],
        'display-lg': ['28px', { lineHeight: '1.15', letterSpacing: '-0.3px', fontWeight: '500' }],
        'h1': ['22px', { lineHeight: '1.2', letterSpacing: '-0.2px', fontWeight: '500' }],
        'h2': ['18px', { lineHeight: '1.3', letterSpacing: '0px', fontWeight: '500' }],
        'h3': ['16px', { lineHeight: '1.4', letterSpacing: '0px', fontWeight: '500' }],
        'body-lg': ['15px', { lineHeight: '1.6', letterSpacing: '0px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '1.6', letterSpacing: '0px', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', letterSpacing: '0.1px', fontWeight: '400' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
        'numeric-lg': ['20px', { lineHeight: '1.2', letterSpacing: '0px', fontWeight: '500' }],
        'numeric-sm': ['14px', { lineHeight: '1.4', letterSpacing: '0px', fontWeight: '400' }],
      },
      spacing: {
        // 8-point grid system
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '999px',
      },
      boxShadow: {
        // Elevation system
        'level-0': 'none',
        'level-1': '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)',
        'level-2': '0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06)',
        'level-3': '0 8px 24px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.08)',
        'level-4': '0 20px 48px rgba(0,0,0,.16), 0 8px 16px rgba(0,0,0,.10)',
        // Semantic alert shadows
        'alert-warning': '0 4px 12px rgba(217,119,6,.15), 0 2px 4px rgba(0,0,0,.06)',
        'alert-danger': '0 4px 12px rgba(220,38,38,.18), 0 2px 4px rgba(0,0,0,.06)',
        'alert-success': '0 4px 12px rgba(5,150,105,.12), 0 2px 4px rgba(0,0,0,.04)',
        'alert-info': '0 4px 12px rgba(20,85,168,.10), 0 2px 4px rgba(0,0,0,.04)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
