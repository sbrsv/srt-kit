import { parse } from '../parse.js';
import { format } from '../format.js';

/** Offset every cue by `offsetMs`. Cues cannot start before zero. */
export function shift(source, offsetMs) {
  const cues = parse(source).map((cue) => ({
    ...cue,
    start: Math.max(0, cue.start + offsetMs),
    end: Math.max(0, cue.end + offsetMs),
  }));
  return format(cues);
}

/** Parse a CLI offset: "1500", "1500ms", "2.5s", "-2s". */
export function parseOffset(input) {
  const m = /^(-?\d+(?:\.\d+)?)(ms|s)?$/.exec(String(input).trim());
  if (!m) throw new Error(`Invalid offset: "${input}" (try 1500ms or -2.5s)`);
  const value = Number(m[1]);
  return m[2] === 's' ? Math.round(value * 1000) : Math.round(value);
}
