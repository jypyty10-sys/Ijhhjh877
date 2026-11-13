import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite runs inside the sandbox container; `process` is available at runtime but we
// avoid pulling Node typings into the browser tsconfig.
declare const process: { env: Record<string, string | undefined> };

const isPreview = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // The preview proxy reaches the dev server as <port>-<sandbox-id>.<domain>,
    // so the dev host allowlist has to cover every subdomain.
    allowedHosts: isPreview && sandboxDomain ? [`.${sandboxDomain}`] : undefined,
    // HMR is served through the https preview proxy on the public port.
    hmr: isPreview ? { protocol: 'wss', clientPort: 443 } : undefined,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://api:8000',
        changeOrigin: false,
      },
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome100',
  },
});
