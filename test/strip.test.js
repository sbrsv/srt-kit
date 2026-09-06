import test from 'node:test';
import assert from 'node:assert/strict';
import { strip } from '../src/commands/strip.js';

const SAMPLE = `1
00:00:01,000 --> 00:00:03,000
Hello there.

2
00:00:04,500 --> 00:00:06,000
General Kenobi.
Second line.
`;

test('drops timings and indices', () => {
  assert.equal(strip(SAMPLE), 'Hello there.\nGeneral Kenobi. Second line.\n');
});

test('keeps internal line breaks when asked', () => {
  assert.equal(
    strip(SAMPLE, { keepLineBreaks: true }),
    'Hello there.\nGeneral Kenobi.\nSecond line.\n'
  );
});

test('joins cues with a custom separator', () => {
  assert.equal(strip(SAMPLE, { join: ' ' }), 'Hello there. General Kenobi. Second line.\n');
});

test('handles an empty document', () => {
  assert.equal(strip(''), '\n');
});
