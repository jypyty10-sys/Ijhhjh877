import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiTarget = process.env.VITE_API_TARGET || 'http://127.0.0.1:4000';

// The sandbox preview is served through a proxy, so the host header is the
// sandbox host and the browser origin is the public host. Both are only
// allow-listed when BASE44_PREVIEW_MODE is exactly "1".
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const allowedHosts = previewMode
  ? [
      'localhost',
      '.localhost',
      ...(process.env.BASE44_SANDBOX_HOST_DOMAIN ? [`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`] : []),
      ...(process.env.BASE44_PUBLIC_HOST_SUFFIX ? [process.env.BASE44_PUBLIC_HOST_SUFFIX] : []),
    ]
  : [];

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: false,
      },
    },
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts,
  },
});
