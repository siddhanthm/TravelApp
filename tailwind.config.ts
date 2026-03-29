import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          bright: 'var(--surface-bright)',
          dim: 'var(--surface-dim)',
          tint: 'var(--surface-tint)',
          variant: 'var(--surface-variant)',
          'container-lowest': 'var(--surface-container-lowest)',
          'container-low': 'var(--surface-container-low)',
          container: 'var(--surface-container)',
          'container-high': 'var(--surface-container-high)',
          'container-highest': 'var(--surface-container-highest)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          container: 'var(--primary-container)',
          fixed: 'var(--primary-fixed)',
          'fixed-dim': 'var(--primary-fixed-dim)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          container: 'var(--secondary-container)',
          fixed: 'var(--secondary-fixed)',
          'fixed-dim': 'var(--secondary-fixed-dim)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          container: 'var(--tertiary-container)',
          fixed: 'var(--tertiary-fixed)',
          'fixed-dim': 'var(--tertiary-fixed-dim)',
        },
        error: {
          DEFAULT: 'var(--error)',
          container: 'var(--error-container)',
        },
        'on-primary': {
          DEFAULT: 'var(--on-primary)',
          container: 'var(--on-primary-container)',
          fixed: 'var(--on-primary-fixed)',
          'fixed-variant': 'var(--on-primary-fixed-variant)',
        },
        'on-secondary': {
          DEFAULT: 'var(--on-secondary)',
          container: 'var(--on-secondary-container)',
          fixed: 'var(--on-secondary-fixed)',
          'fixed-variant': 'var(--on-secondary-fixed-variant)',
        },
        'on-tertiary': {
          DEFAULT: 'var(--on-tertiary)',
          container: 'var(--on-tertiary-container)',
          fixed: 'var(--on-tertiary-fixed)',
          'fixed-variant': 'var(--on-tertiary-fixed-variant)',
        },
        'on-error': {
          DEFAULT: 'var(--on-error)',
          container: 'var(--on-error-container)',
        },
        'on-surface': {
          DEFAULT: 'var(--on-surface)',
          variant: 'var(--on-surface-variant)',
        },
        'on-background': 'var(--on-background)',
        background: 'var(--background)',
        outline: {
          DEFAULT: 'var(--outline)',
          variant: 'var(--outline-variant)',
        },
        inverse: {
          surface: 'var(--inverse-surface)',
          'on-surface': 'var(--inverse-on-surface)',
          primary: 'var(--inverse-primary)',
        },
      },
      fontFamily: {
        headline: ['Epilogue', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        ambient: '0 8px 32px 0 rgba(0,0,0,0.04)',
        card: '0 2px 8px 0 rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}

export default config
