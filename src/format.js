import { formatTimestamp } from './time.js';

/**
 * Serialise cues back to an SRT document. Indices are rewritten so the
 * output is always sequential from 1.
 */
export function format(cues) {
  return (
    cues
      .map((cue, i) =>
        [
          String(i + 1),
          `${formatTimestamp(cue.start)} --> ${formatTimestamp(cue.end)}`,
          cue.text,
        ].join('\n')
      )
      .join('\n\n') + '\n'
  );
}
