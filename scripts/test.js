#!/usr/bin/env node
// `node --test` only learned to expand glob patterns in Node 21, and passing
// it a bare directory behaves differently again across platforms. Enumerating
// the files ourselves is the one approach that works on every version the
// package claims to support.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const testDir = fileURLToPath(new URL('../test/', import.meta.url));

const files = readdirSync(testDir)
  .filter((name) => name.endsWith('.test.js'))
  .sort()
  .map((name) => join(testDir, name));

if (files.length === 0) {
  console.error('No test files found in test/');
  process.exit(1);
}

const { status } = spawnSync(process.execPath, ['--test', ...files], {
  stdio: 'inherit',
});

process.exit(status ?? 1);
