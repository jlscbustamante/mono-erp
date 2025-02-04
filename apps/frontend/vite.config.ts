import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react({
      tsDecorators: true,
    }),
    tsconfigPaths(),
  ],
  resolve: {
    // alias: { '@': resolve(__dirname, 'src') },
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
})
