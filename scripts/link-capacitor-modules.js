#!/usr/bin/env node
/**
 * npm workspaces hoist @capacitor/* to the repo root. The Angular language
 * service under Mobile/ sometimes only looks in Mobile/node_modules, so link
 * Capacitor packages there for IDE resolution.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'node_modules', '@capacitor');
const destDir = path.join(root, 'Mobile', 'node_modules', '@capacitor');

if (!fs.existsSync(srcDir)) {
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

for (const name of fs.readdirSync(srcDir)) {
  const from = path.join(srcDir, name);
  const to = path.join(destDir, name);
  if (!fs.statSync(from).isDirectory()) {
    continue;
  }
  try {
    fs.rmSync(to, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  fs.symlinkSync(path.relative(destDir, from), to, 'dir');
}
