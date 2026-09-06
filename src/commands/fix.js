import { parse } from '../parse.js';
import { format } from '../format.js';

const MIN_DURATION = 200;
const MIN_GAP = 1;

/**
 * Repair the faults that break players and burn-in tools:
 *   - cues out of chronological order
 *   - a cue that overlaps the one before it
 *   - zero-length or backwards durations
 *   - non-sequential indices
 *
 * Returns { output, repairs } so a caller can report what it touched.
 */
export function fix(source, { minDuration = MIN_DURATION } = {}) {
  const cues = parse(source);
  const repairs = [];

  const ordered = [...cues].sort((a, b) => a.start - b.start);
  if (ordered.some((cue, i) => cue !== cues[i])) {
    repairs.push('reordered cues by start time');
  }

  let overlaps = 0;
  let durations = 0;

  for (let i = 0; i < ordered.length; i += 1) {
    const cue = ordered[i];
    const previous = ordered[i - 1];

    if (previous && cue.start < previous.end) {
      cue.start = previous.end + MIN_GAP;
      overlaps += 1;
    }

    if (cue.end - cue.start < minDuration) {
      cue.end = cue.start + minDuration;
      durations += 1;
    }
  }

  if (overlaps) repairs.push(`separated ${overlaps} overlapping cue(s)`);
  if (durations) repairs.push(`extended ${durations} cue(s) to ${minDuration}ms`);

  return { output: format(ordered), repairs };
}
