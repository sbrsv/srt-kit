import test from 'node:test';
import assert from 'node:assert/strict';
import { fix } from '../src/commands/fix.js';
import { parse } from '../src/parse.js';

test('separates overlapping cues', () => {
  const { output, repairs } = fix(`1
00:00:01,000 --> 00:00:05,000
First.

2
00:00:03,000 --> 00:00:07,000
Second.
`);
  const cues = parse(output);
  assert.ok(cues[1].start >= cues[0].end);
  assert.match(repairs.join(' '), /separated 1 overlapping/);
});

test('reorders cues that arrive out of sequence', () => {
  const { output, repairs } = fix(`1
00:00:09,000 --> 00:00:10,000
Later.

2
00:00:01,000 --> 00:00:02,000
Earlier.
`);
  assert.equal(parse(output)[0].text, 'Earlier.');
  assert.match(repairs.join(' '), /reordered/);
});

test('extends a zero-length cue to the minimum duration', () => {
  const { output } = fix(`1
00:00:01,000 --> 00:00:01,000
Blink.
`);
  const [cue] = parse(output);
  assert.equal(cue.end - cue.start, 200);
});

test('respects a custom minimum duration', () => {
  const { output } = fix(`1
00:00:01,000 --> 00:00:01,000
Blink.
`, { minDuration: 1000 });
  const [cue] = parse(output);
  assert.equal(cue.end - cue.start, 1000);
});

test('reports no repairs on a clean file', () => {
  const { repairs } = fix(`1
00:00:01,000 --> 00:00:03,000
Fine.

2
00:00:04,000 --> 00:00:06,000
Also fine.
`);
  assert.deepEqual(repairs, []);
});
