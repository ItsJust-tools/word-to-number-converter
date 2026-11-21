/**
 * Ordinal helpers: convert an integer to its ordinal word form
 * ("first", "second", "third", "twenty-first", "one hundred second"...).
 */

import { ONES, TENS, ORDINAL_IRREGULAR } from './word-data';

const on = (index: number): string => ONES[index] ?? '';
const tn = (index: number): string => TENS[index] ?? '';

/** Ordinal suffix for bare numerals (1 -> st, 2 -> nd, 11th...). */
export function ordinalSuffix(n: number): 'st' | 'nd' | 'rd' | 'th' {
  const mod100 = Math.abs(n) % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  switch (Math.abs(n) % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/** Words for 0-999 in ordinal-aware form; isOrdinal marks the final segment. */
function segmentWords(n: number, isOrdinal: boolean): string {
  if (n < 100) return under100Words(n, isOrdinal);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) {
    const noun = `${on(hundreds)} hundred`;
    return isOrdinal ? `${on(hundreds)} ${ordinalOfWord('hundred')}` : noun;
  }
  return `${on(hundreds)} hundred ${under100Words(rest, isOrdinal)}`;
}

function under100Words(n: number, isOrdinal: boolean): string {
  if (n < 20) {
    const word = on(n);
    return isOrdinal ? ordinalOfWord(word) : word;
  }
  const ten = Math.floor(n / 10);
  const one = n % 10;
  if (one === 0) {
    const word = TENS[ten] ?? '';
    return isOrdinal ? (word === 'six' ? 'sixth' : word.endsWith('y') ? word.slice(0, -1) + 'ieth' : word + 'th') : word;
  }
  return `${tn(ten)}-${ordinalOfWord(on(one))}`;
}

/** Convert a cardinal word to its ordinal equivalent, applying irregulars. */
function ordinalOfWord(word: string): string {
  if (ORDINAL_IRREGULAR[word]) return ORDINAL_IRREGULAR[word];
  if (word === 'six') return 'sixth';
  if (word.endsWith('y')) return word.slice(0, -1) + 'ieth';
  return word + 'th';
}

/**
 * Integer to ordinal words: 1 -> "first", 21 -> "twenty-first",
 * 100 -> "one hundredth", 101 -> "one hundred first", 1234 -> "one thousand two hundred thirty-fourth".
 * Returns null for non-safe integers.
 */
export function integerToOrdinal(value: number): string | null {
  if (!Number.isSafeInteger(value)) return null;
  if (value === 0) return 'zeroth';
  const positive = Math.abs(value);
  let remainder = positive;
  const scaleWords = [
    { value: 1_000_000_000_000, name: 'trillion' },
    { value: 1_000_000_000, name: 'billion' },
    { value: 1_000_000, name: 'million' },
    { value: 1_000, name: 'thousand' },
  ];
  // Build cardinal segments, then ordinalize the final segment.
  const parts: { count: number; scaleValue: number; scaleName: string | null }[] = [];
  for (const scale of scaleWords) {
    const count = Math.floor(remainder / scale.value);
    if (count > 0) {
      parts.push({ count, scaleValue: scale.value, scaleName: scale.name });
      remainder -= count * scale.value;
    }
  }
  const text = (() => {
    if (remainder === 0) {
      // exact multiple of a scale: ordinalize the last scale word
      const last = parts[parts.length - 1];
      if (!last) return 'zeroth';
      const head = parts
        .slice(0, -1)
        .map((part) => `${segmentWords(part.count, false)} ${part.scaleName}`)
        .join(' ');
      const lastText = `${segmentWords(last.count, false)} ${ordinalOfWord(last.scaleName ?? '')}`;
      return head ? `${head} ${lastText}` : lastText;
    }
    const head = parts.map((part) => `${segmentWords(part.count, false)} ${part.scaleName}`).join(' ');
    const tail = segmentWords(remainder, true);
    return head ? `${head} ${tail}` : tail;
  })();
  return value < 0 ? `negative ${text}` : text;
}

/** Numeral + suffix form: 21 -> "21st". */
export function numeralOrdinal(value: number): string | null {
  if (!Number.isSafeInteger(value)) return null;
  return `${value}${ordinalSuffix(value)}`;
}
