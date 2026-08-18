import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  // react-markdown pulls in a deep tree of tiny ESM packages (unified, remark,
  // mdast, micromark, hast, …). Rollup's production resolver walks that tree
  // strictly and, in a real Node install, trips on nested transitive imports
  // ("Rollup failed to resolve import 'mdast-util-from-markdown'", etc.).
  // Forcing Vite to pre-bundle react-markdown with esbuild — which resolves the
  // whole tree in one pass — sidesteps that entirely. This is the root-cause fix
  // for the string of missing-dependency build errors on the VPS.
  optimizeDeps: {
    include: ["react-markdown"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    onConsoleLog(log) {
      return !log.includes("React Router Future Flag Warning");
    },
    env: {
      DEBUG_PRINT_LIMIT: '0', // Suppress DOM output that exceeds AI context windows
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));