import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react({
      tsDecorators: true,
    }),
  ],
  resolve: {
    // alias: { '@': resolve(__dirname, 'src') },
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
})
