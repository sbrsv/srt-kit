import { parse } from '../parse.js';

/**
 * Reduce an SRT document to its spoken text, one cue per line.
 * Useful for feeding a transcript to a translator, a summariser or a
 * word count without the timing noise.
 */
export function strip(source, { keepLineBreaks = false, join = '\n' } = {}) {
  return (
    parse(source)
      .map((cue) => (keepLineBreaks ? cue.text : cue.text.replace(/\n/g, ' ')))
      .join(join) + '\n'
  );
}
