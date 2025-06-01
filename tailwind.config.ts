import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['var(--font-luckiest-guy)', 'sans-serif'], // Temporarily comment out
        luckiest: ['var(--font-luckiest-guy)', 'cursive'], // Direct utility for Luckiest Guy
        // You can add Cooper Black here too if you find a good web font for it
        // cooper: ['Cooper Black', 'serif'], // Example placeholder
      },
      colors: {
        // Albuquerque Hotspot brand colors
        hotspot: {
          red: '#DC2626',      // A vibrant red
          gold: '#F59E0B',     // A warm gold/amber
          black: '#1F2937',    // A rich dark gray-black
          white: '#FFFFFF',    // Pure white
          cream: '#FEF7ED',    // A warm cream background
          lightGold: '#FEF3C7', // Light gold for backgrounds
        },
        // Additional grays for text and backgrounds
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config; 