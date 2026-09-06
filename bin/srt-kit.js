#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { shift, parseOffset } from '../src/commands/shift.js';
import { strip } from '../src/commands/strip.js';

const USAGE = `srt-kit — tools for SRT subtitle files

Usage:
  srt-kit shift <file> <offset> [-o out.srt]
  srt-kit strip <file> [--keep-breaks] [-o out.txt]

Offsets accept ms (default) or seconds: 1500, 1500ms, 2.5s, -2s.
Without -o the result is written to stdout.
`;

function readInput(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    throw new Error(`Cannot read ${path}: ${err.message}`);
  }
}

function output(text, argv) {
  const i = argv.findIndex((a) => a === '-o' || a === '--out');
  if (i === -1) {
    process.stdout.write(text);
    return;
  }
  const dest = argv[i + 1];
  if (!dest) throw new Error('-o requires a file path');
  writeFileSync(dest, text, 'utf8');
  process.stderr.write(`Wrote ${dest}\n`);
}

function main(argv) {
  const [command, ...rest] = argv;

  if (!command || command === '-h' || command === '--help') {
    process.stdout.write(USAGE);
    return;
  }

  if (command === 'shift') {
    const [file, offset] = rest;
    if (!file || !offset) throw new Error('shift needs a file and an offset');
    output(shift(readInput(file), parseOffset(offset)), rest);
    return;
  }

  if (command === 'strip') {
    const [file] = rest;
    if (!file) throw new Error('strip needs a file');
    output(strip(readInput(file), { keepLineBreaks: rest.includes('--keep-breaks') }), rest);
    return;
  }

  throw new Error(`Unknown command: ${command}\n\n${USAGE}`);
}

try {
  main(process.argv.slice(2));
} catch (err) {
  process.stderr.write(`error: ${err.message}\n`);
  process.exitCode = 1;
}
