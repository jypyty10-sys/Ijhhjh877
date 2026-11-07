#!/usr/bin/env node
// Runs the API (watched) and the Vite dev server together in one container.
import { spawn } from 'node:child_process';

const children = [];

function start(name, cmd, args) {
  const child = spawn(cmd, args, { stdio: 'inherit', env: process.env });
  children.push({ name, child });
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.log(`[dev] ${name} exited (code=${code} signal=${signal})`);
    shutdown(code ?? 0);
  });
  return child;
}

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const { child } of children) {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }
  setTimeout(() => process.exit(code), 400);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('api', process.execPath, ['--watch', 'server/index.js']);
start('web', 'node_modules/.bin/vite', ['--host', '0.0.0.0', '--port', '3000', '--strictPort']);
