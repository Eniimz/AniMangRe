/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    screens: {
      vsm: '360px',
      sm: '480px',
      lmd:'585px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
} 