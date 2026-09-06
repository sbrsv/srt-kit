import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTimestamp, formatTimestamp } from '../src/time.js';

test('parses a standard SRT timestamp', () => {
  assert.equal(parseTimestamp('00:01:02,500'), 62500);
});

test('accepts a dot as the decimal separator', () => {
  assert.equal(parseTimestamp('00:00:01.250'), 1250);
});

test('rejects nonsense', () => {
  assert.throws(() => parseTimestamp('banana'), /Invalid SRT timestamp/);
});

test('formats milliseconds back to a timestamp', () => {
  assert.equal(formatTimestamp(62500), '00:01:02,500');
});

test('clamps negative times to zero', () => {
  assert.equal(formatTimestamp(-500), '00:00:00,000');
});

test('round-trips', () => {
  assert.equal(formatTimestamp(parseTimestamp('01:23:45,678')), '01:23:45,678');
});
