import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: `import.meta.env.CLIENT_PORT`,
    strictPort: true,
    host: true,
    watch: {
      usePolling: true
    }
  },
})
