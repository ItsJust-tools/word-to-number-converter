/**
 * Shared numeric helpers used by both directions of the converter.
 * US short-scale naming: thousand, million, billion, trillion.
 */

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

const SCALES: { value: number; name: string }[] = [
  { value: 1_000_000_000_000, name: 'trillion' },
  { value: 1_000_000_000, name: 'billion' },
  { value: 1_000_000, name: 'million' },
  { value: 1_000, name: 'thousand' },
  { value: 100, name: 'hundred' },
];

/** Words for 0-99 (no "and"). */
function wordsUnder100(n: number): string {
  if (n < 20) return ONES[n] ?? '';  // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one === 0 ? (TENS[ten] ?? '') : `${TENS[ten] ?? ''}-${ONES[one] ?? ''}`;
}

/** Words for 0-999. */
const on = (index: number): string => ONES[index] ?? '';

function wordsUnder1000(n: number): string {
  if (n < 100) return wordsUnder100(n);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return rest === 0 ? `${on(hundreds)} hundred` : `${on(hundreds)} hundred ${wordsUnder100(rest)}`;
}

/** Words for a non-negative integer < 10^15, with optional comma formatting between scale groups. */
export function integerToWords(value: number, format: 'lower' | 'title' | 'commas'): string {
  const positive = Math.abs(Math.trunc(value));
  if (positive === 0) return capitalizeWords('zero', format);

  let remainder = positive;
  const groups: string[] = [];
  for (const scale of SCALES) {
    if (scale.value < 1000) break; // hundred stays inside wordsUnder1000
    const count = Math.floor(remainder / scale.value);
    if (count > 0) {
      groups.push(`${wordsUnder1000(count)} ${scale.name}`);
      remainder -= count * scale.value;
    }
  }
  if (remainder > 0) groups.push(wordsUnder1000(remainder));

  let text: string;
  if (format === 'commas') {
    text = groups.join(', ');
  } else {
    text = groups.join(' ');
  }
  return capitalizeWords(text, format);
}

function capitalizeWords(text: string, format: 'lower' | 'title' | 'commas'): string {
  if (format === 'title') {
    return text
      .split(/([ -])/)
      .map((part) => (part && /[a-z]/.test(part.charAt(0)) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
      .join('');
  }
  return text;
}

/** Pluralize a word: million -> million, 2 -> million -> millions handled by caller logic. */
export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word.endsWith('y') ? word.slice(0, -1) + 'ies' : word + 's';
}
