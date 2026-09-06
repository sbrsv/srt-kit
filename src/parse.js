import { parseTimestamp } from './time.js';

const ARROW = /\s*-->\s*/;

/**
 * Parse an SRT document into cues: { index, start, end, text }.
 * Timings are milliseconds. Tolerates CRLF, a leading BOM, missing index
 * lines and extra blank lines between blocks.
 */
export function parse(source) {
  const normalised = String(source).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const blocks = normalised.split(/\n{2,}/);
  const cues = [];

  for (const block of blocks) {
    const lines = block.split('\n').filter((line) => line.trim() !== '');
    if (lines.length === 0) continue;

    let cursor = 0;
    let index = cues.length + 1;

    // A block may open with an identifier line. SRT uses a number; WebVTT
    // allows an arbitrary string. Consume either, but only when the line
    // that follows is a timing line -- otherwise this is not a cue at all
    // (a WEBVTT header, a NOTE block) and the whole block is skipped below.
    if (!ARROW.test(lines[cursor]) && lines[cursor + 1] !== undefined && ARROW.test(lines[cursor + 1])) {
      const identifier = lines[cursor].trim();
      if (/^\d+$/.test(identifier)) index = Number(identifier);
      cursor += 1;
    }

    const timing = lines[cursor];
    if (timing === undefined || !ARROW.test(timing)) continue;
    cursor += 1;

    const [rawStart, rawEnd] = timing.split(ARROW);
    cues.push({
      index,
      start: parseTimestamp(rawStart),
      end: parseTimestamp(rawEnd),
      text: lines.slice(cursor).join('\n'),
    });
  }

  return cues;
}
