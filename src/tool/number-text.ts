/**
 * Full number-string -> words conversion with sign and decimal support.
 * "12345" -> "twelve thousand three hundred forty-five"
 * "-3.5"  -> "negative three point five"
 */

import { integerToWords } from './number-to-words';

export interface NumberToWordsResult {
  text: string;
  error: string | null;
}

const ONES_DIGIT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const TITLE_PRESETS = { lower: 'lower', title: 'title', commas: 'commas' } as const;

export type WordsFormat = keyof typeof TITLE_PRESETS;

/** Parse number text into words; supports optional sign and single decimal point. */
export function numberToWordsText(input: string, format: WordsFormat): NumberToWordsResult {
  const trimmed = input.trim();
  if (!trimmed) return { text: '', error: 'Enter a number' };

  const match = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(trimmed);
  if (!match) {
    return { text: '', error: `"${trimmed}" is not a valid number. Use digits and an optional decimal point.` };
  }
  const [, sign = '', intPartRaw = '', fracRaw = ''] = match;
  if (!intPartRaw && !fracRaw) {
    return { text: '', error: `"${trimmed}" is not a valid number` };
  }

  const intPart = intPartRaw || '0';
  const intValue = Number.parseInt(intPart, 10);
  if (!Number.isSafeInteger(intValue) || intValue > 999_999_999_999_999) {
    return { text: '', error: 'Number is too large (limit: 999 trillion)' };
  }

  let text = integerToWords(intValue, TITLE_PRESETS[format]).replace(/^zero$/, intPartRaw === '0' ? 'zero' : 'zero');
  if (sign === '-') text = `negative ${text}`;

  if (fracRaw !== '') {
    const digits = fracRaw
      .split('')
      .map((d) => ONES_DIGIT[Number.parseInt(d, 10)])
      .join(' ');
    text += ` point ${digits}`;
  }

  return { text, error: null };
}
