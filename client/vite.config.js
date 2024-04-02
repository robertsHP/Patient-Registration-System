import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, path.resolve(__dirname, "../")) };
  return defineConfig({
    plugins: [react()],
    envDir: "../",
    server: {
      port: process.env.CLIENT_PORT,
      strictPort: true,
      host: true,
      watch: {
        usePolling: true
      }
    }
  })
}