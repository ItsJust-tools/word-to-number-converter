/**
 * English word-number parser (US short scale) with validation.
 * Accepts mixed word forms: "twelve thousand three hundred forty-five",
 * optional "and" (British style), digits mixed with words ("12 thousand"),
 * negative prefix ("negative"/"minus"), ordinals are NOT parsed here.
 */

import { ONES, TENS, SCALES } from './word-data';

const on = (index: number): string => ONES[index] ?? '';

export interface WordsParseResult {
  /** Parsed numeric value, or null when parsing failed. */
  value: number | null;
  /** Human-readable error when value is null. */
  error: string | null;
}

interface Token {
  kind: 'number' | 'scale';
  number?: number;
  scale?: number;
}

const WORD_MAP: Map<string, Token> = buildMap();

function buildMap(): Map<string, Token> {
  const map = new Map<string, Token>();
  ONES.forEach((word, index) => map.set(word, { kind: 'number', number: index }));
  TENS.forEach((word, index) => {
    if (word) map.set(word, { kind: 'number', number: index * 10 });
  });
  for (const scale of SCALES) map.set(scale.name, { kind: 'scale', scale: scale.value });
  map.set('hundred', { kind: 'scale', scale: 100 });
  return map;
}

/**
 * Normalize input text into lowercase word tokens.
 * Splits hyphenated words ("forty-five") and digits ("12 thousand").
 */
export function tokenizeWords(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/-/g, ' ')
    .split(/[\s,]+/)
    .filter((token) => token.length > 0);
}

/** Parse English number words to a value. Returns { value: null, error } on invalid input. */
export function wordsToNumber(input: string): WordsParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { value: null, error: 'Enter a number in words' };

  let tokens = tokenizeWords(trimmed);
  if (tokens.length === 0) return { value: null, error: 'Enter a number in words' };

  // Optional "and" (British style: one hundred and five) is ignored.
  tokens = tokens.filter((token) => token !== 'and');

  let negative = false;
  if (tokens[0] === 'negative' || tokens[0] === 'minus') {
    negative = true;
    tokens = tokens.slice(1);
    if (tokens.length === 0) return { value: null, error: 'Missing number after sign word' };
  }

  let total = 0;
  let current = 0; // value of the current group being built
  let sawNumber = false;
  let hundredUsed = false;

  for (const token of tokens) {
    const entry = WORD_MAP.get(token);
    if (!entry) {
      return { value: null, error: `"${token}" is not a recognized number word` };
    }
    if (entry.kind === 'number') {
      const n = entry.number ?? 0;
      // ones after non-zero ones within a group are malformed (e.g. "five three")
      if (current % 10 !== 0 && n < 10 && current > 0) {
        return { value: null, error: `Unexpected word "${token}"` };
      }
      current += n;
      sawNumber = true;
    } else {
      const scale = entry.scale ?? 1;
      if (scale === 100) {
        if (current === 0 || hundredUsed) {
          return { value: null, error: '"hundred" needs a number before it' };
        }
        current *= 100;
        hundredUsed = true;
        continue;
      }
      if (current === 0) {
        return { value: null, error: `"${token}" needs a number before it` };
      }
      if (scale < current) {
        return { value: null, error: `"${token}" appears out of order` };
      }
      total += current * scale;
      current = 0;
      hundredUsed = false;
    }
  }

  if (!sawNumber) return { value: null, error: 'No number words found' };

  const value = total + current;
  if (!Number.isSafeInteger(value)) {
    return { value: null, error: 'Number is too large' };
  }
  return { value: negative ? -value : value, error: null };
}
