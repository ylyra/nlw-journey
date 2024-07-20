import type { Config } from 'tailwindcss'
import { colors } from './src/styles/colors'
import { fontFamily } from './src/styles/fontFamily'

export default {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
} satisfies Config

