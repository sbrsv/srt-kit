import test from 'node:test';
import assert from 'node:assert/strict';
import { shift, parseOffset } from '../src/commands/shift.js';

const SAMPLE = `1
00:00:01,000 --> 00:00:03,000
Hello there.
`;

test('shifts cues forward', () => {
  assert.match(shift(SAMPLE, 500), /00:00:01,500 --> 00:00:03,500/);
});

test('never shifts a cue before zero', () => {
  assert.match(shift(SAMPLE, -5000), /00:00:00,000 --> 00:00:00,000/);
});

test('parses offsets in ms and seconds', () => {
  assert.equal(parseOffset('1500'), 1500);
  assert.equal(parseOffset('1500ms'), 1500);
  assert.equal(parseOffset('2.5s'), 2500);
  assert.equal(parseOffset('-2s'), -2000);
});

test('rejects a bad offset', () => {
  assert.throws(() => parseOffset('soon'), /Invalid offset/);
});
