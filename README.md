# srt-kit

A zero-dependency CLI for working with SRT subtitle files. No install step,
no `node_modules`, just Node 18+.

## Install

```bash
npx srt-kit --help
```

Or clone and link it:

```bash
git clone https://github.com/sbrsv/srt-kit.git
cd srt-kit && npm link
```

## Commands

### `shift` â€” move every cue in time

```bash
srt-kit shift movie.srt 2.5s -o fixed.srt
srt-kit shift movie.srt -800ms
```

Offsets take milliseconds by default; `s` and `ms` suffixes both work, and a
leading `-` shifts subtitles earlier. Cues never move before `00:00:00,000`.
Without `-o` the result goes to stdout, so it pipes.

### `strip` — pull the plain text out

```bash
srt-kit strip movie.srt -o transcript.txt
srt-kit strip movie.srt --keep-breaks
```

Drops indices and timings and leaves one cue per line — handy for word
counts, translation passes or feeding a transcript to something else. By
default a cue's internal line breaks are flattened to spaces;
`--keep-breaks` preserves them.

## Library use

The parser is exported too, if you want the cues rather than a file:

```js
import { parse } from 'srt-kit/src/parse.js';

const cues = parse(await readFile('movie.srt', 'utf8'));
// [{ index: 1, start: 1000, end: 3000, text: 'Hello there.' }, ...]
```

Timings are milliseconds. The parser tolerates CRLF line endings, a leading
BOM, missing index lines and stray blank lines between blocks â€” all of which
show up in real subtitle files from the wild.

## Tests

```bash
npm test
```

## License

MIT
