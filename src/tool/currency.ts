/**
 * Check-writing currency formatting: $1,234.56 ->
 * "one thousand two hundred thirty-four dollars and 56/100".
 */

import { integerToWords } from './number-to-words';

export interface CurrencyResult {
  /** Check-style text or an error message when invalid. */
  text: string;
  error: string | null;
}

/** Format a currency amount as check-style words. Amount is a plain number string. */
export function currencyToWords(amount: string, capitalize: boolean): CurrencyResult {
  const trimmed = amount.trim();
  if (!trimmed) return { text: '', error: 'Enter a currency amount' };

  const match = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(trimmed.replace(/[$,\s]/g, ''));
  if (!match) {
    return { text: '', error: `"${trimmed}" is not a valid currency amount` };
  }
  const [, sign = '', intPartRaw = '', fracPartRaw = ''] = match;
  if (!intPartRaw && !fracPartRaw) {
    return { text: '', error: `"${trimmed}" is not a valid currency amount` };
  }
  const intPart = intPartRaw || '0';
  const intValue = Number.parseInt(intPart, 10);
  if (!Number.isSafeInteger(intValue) || intValue > 9_999_999_999_999) {
    return { text: '', error: 'Amount is too large for check writing' };
  }
  const fracDigits = (fracPartRaw ?? '').slice(0, 2).padEnd(2, '0').slice(0, 2);
  const fracNumber = Number.parseInt(fracDigits, 10);

  const dollarWord = intValue === 1 ? 'dollar' : 'dollars';
  let text = `${integerToWords(intValue, 'lower')} ${dollarWord}`;
  if (fracNumber > 0) {
    text += ` and ${fracDigits}/100`;
  } else {
    text += ' and 00/100';
  }
  if (sign === '-') text = `minus ${text}`;
  if (capitalize) {
    text = text
      .split(/([ -])/)
      .map((part) => (part && /[a-z]/.test(part.charAt(0)) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
      .join('');
  }
  return { text, error: null };
}
