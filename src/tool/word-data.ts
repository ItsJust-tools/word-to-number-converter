/** Shared vocabulary tables for number word conversion (US short scale). */

export const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];

export const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

export const SCALES = [
  { value: 1_000_000_000_000, name: 'trillion' },
  { value: 1_000_000_000, name: 'billion' },
  { value: 1_000_000, name: 'million' },
  { value: 1_000, name: 'thousand' },
  { value: 100, name: 'hundred' },
];

/** Irregular ordinal word replacements for the final cardinal word. */
export const ORDINAL_IRREGULAR: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
};

/** Higher scale words get ordinal suffixes directly. */
export const ORDINAL_SCALE_WORDS = ['hundred', 'thousand', 'million', 'billion', 'trillion'] as const;
