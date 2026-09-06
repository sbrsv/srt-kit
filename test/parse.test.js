import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/parse.js';
import { format } from '../src/format.js';

const SAMPLE = `1
00:00:01,000 --> 00:00:03,000
Hello there.

2
00:00:04,500 --> 00:00:06,000
General Kenobi.
Second line.
`;

test('parses cues with timings in milliseconds', () => {
  const cues = parse(SAMPLE);
  assert.equal(cues.length, 2);
  assert.equal(cues[0].start, 1000);
  assert.equal(cues[0].end, 3000);
  assert.equal(cues[0].text, 'Hello there.');
});

test('keeps multi-line cue text', () => {
  assert.equal(parse(SAMPLE)[1].text, 'General Kenobi.\nSecond line.');
});

test('tolerates CRLF and a BOM', () => {
  const messy = '﻿' + SAMPLE.replace(/\n/g, '\r\n');
  assert.equal(parse(messy).length, 2);
});

test('survives a missing index line', () => {
  const cues = parse('00:00:01,000 --> 00:00:02,000\nNo index.');
  assert.equal(cues.length, 1);
  assert.equal(cues[0].index, 1);
});

test('format renumbers output sequentially', () => {
  const cues = parse(SAMPLE);
  cues[0].index = 99;
  assert.match(format(cues), /^1\n00:00:01,000/);
});
