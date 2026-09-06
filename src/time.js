const STAMP = /^(\d{1,3}):([0-5]?\d):([0-5]?\d)[,.](\d{1,3})$/;

/**
 * Parse an SRT timestamp ("00:01:02,500") into milliseconds.
 * Accepts "." as the decimal separator, which some tools emit.
 */
export function parseTimestamp(input) {
  const m = STAMP.exec(String(input).trim());
  if (!m) throw new Error(`Invalid SRT timestamp: "${input}"`);
  const [, h, min, s, ms] = m;
  return (
    Number(h) * 3600000 +
    Number(min) * 60000 +
    Number(s) * 1000 +
    Number(ms.padEnd(3, '0'))
  );
}

/** Format milliseconds as an SRT timestamp. Negative values clamp to zero. */
export function formatTimestamp(ms) {
  const total = Math.max(0, Math.round(ms));
  const h = Math.floor(total / 3600000);
  const min = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const rem = total % 1000;
  return (
    `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:` +
    `${String(s).padStart(2, '0')},${String(rem).padStart(3, '0')}`
  );
}
