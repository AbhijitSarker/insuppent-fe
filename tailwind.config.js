import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        // Core colors
        core: {
          topbar: '#FFFFFF', // Core/white
          white: '#FFFFFF', // White
          black: '#000000', // Black
        },
        
        // Content colors
        content: {
          brand: '#2563EB', // Blue/600
          primary: '#1C1917', // Gray/900
          secondary: '#78716C', // Gray/500
          tertiary: '#A8A29E', // Gray/400
          inversePrimary: '#FFFFFF', // White
          inverseSecondary: '#9CA3AF', // Gray/400
          inverseTertiary: '#6B7280', // Gray/500
          green: '#15803D', // Green/700
          red: '#B91C1C' // Red/700
        },
        
        // Background colors
        bg: {
          primary: '#FFFFFF', // White
          secondary: '#FAFAF9', // Gray/50
          tertiary: '#F5F5F4', // Gray/100
          brand: '#2563EB', // Blue/600
        },
        
        // Border colors
        borderColor: {
          primary: '#D6D3D1', // Gray/300
          secondary: '#F5F5F4', // Gray/100
          tertiary: '#FAFAF9', // Gray/50
          brand: '#2563EB', // Blue/600
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    }
  },
  plugins: [animate],
  // Add custom utilities for font smoothing
  addUtilities: {
    '.font-smooth': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      'text-rendering': 'optimizeLegibility',
    },
  },
}