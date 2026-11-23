import { describe, it, expect } from 'vitest';
import {
  convert,
  numberToWordsText,
  wordsToNumber,
  integerToWords,
  integerToOrdinal,
  numeralOrdinal,
  ordinalSuffix,
  currencyToWords,
  wordNumberTool,
  tokenizeWords,
} from '../../src/tool/tool-definition';
import { DEFAULT_STATE } from '../../src/tool/types';
import type { ToolState } from '../../src/tool/types';

const state = (patch: Partial<ToolState> = {}): ToolState => ({ ...DEFAULT_STATE, ...patch });

describe('integerToWords', () => {
  it('converts 12345 with US short-scale naming', () => {
    expect(integerToWords(12345, 'lower')).toBe('twelve thousand three hundred forty-five');
  });

  it('converts zero, teens, tens and hyphenation', () => {
    expect(integerToWords(0, 'lower')).toBe('zero');
    expect(integerToWords(17, 'lower')).toBe('seventeen');
    expect(integerToWords(21, 'lower')).toBe('twenty-one');
    expect(integerToWords(40, 'lower')).toBe('forty');
    expect(integerToWords(99, 'lower')).toBe('ninety-nine');
  });

  it('converts hundreds', () => {
    expect(integerToWords(100, 'lower')).toBe('one hundred');
    expect(integerToWords(105, 'lower')).toBe('one hundred five');
    expect(integerToWords(234, 'lower')).toBe('two hundred thirty-four');
  });

  it('converts scales up to trillions', () => {
    expect(integerToWords(1_000, 'lower')).toBe('one thousand');
    expect(integerToWords(1_000_000, 'lower')).toBe('one million');
    expect(integerToWords(2_500_000_000, 'lower')).toBe('two billion five hundred million');
    expect(integerToWords(1_000_000_000_000, 'lower')).toBe('one trillion');
    expect(integerToWords(999_999_999_999_999, 'commas')).toBe(
      'nine hundred ninety-nine trillion, nine hundred ninety-nine billion, nine hundred ninety-nine million, nine hundred ninety-nine thousand, nine hundred ninety-nine'
    );
  });

  it('supports title case and comma groups', () => {
    expect(integerToWords(12345, 'title')).toBe('Twelve Thousand Three Hundred Forty-Five');
    expect(integerToWords(1_234_567, 'commas')).toBe(
      'one million, two hundred thirty-four thousand, five hundred sixty-seven'
    );
  });
});

describe('numberToWordsText', () => {
  it('converts plain integers', () => {
    expect(numberToWordsText('12345', 'lower').text).toBe(
      'twelve thousand three hundred forty-five'
    );
  });

  it('converts negative numbers', () => {
    expect(numberToWordsText('-42', 'lower').text).toBe('negative forty-two');
  });

  it('converts decimal numbers digit by digit', () => {
    expect(numberToWordsText('3.5', 'lower').text).toBe('three point five');
    expect(numberToWordsText('0.75', 'lower').text).toBe('zero point seven five');
    expect(numberToWordsText('-0.1', 'lower').text).toBe('negative zero point one');
  });

  it('rejects malformed input', () => {
    expect(numberToWordsText('abc', 'lower').error).toBeTruthy();
    expect(numberToWordsText('1.2.3', 'lower').error).toBeTruthy();
    expect(numberToWordsText('--5', 'lower').error).toBeTruthy();
    expect(numberToWordsText('', 'lower').error).toBeTruthy();
    expect(numberToWordsText('.', 'lower').error).toBeTruthy();
  });

  it('rejects out-of-range magnitudes', () => {
    expect(numberToWordsText('1000000000000000', 'lower').error).toBeTruthy();
  });
});

describe('wordsToNumber', () => {
  it('parses simple words', () => {
    expect(wordsToNumber('five').value).toBe(5);
    expect(wordsToNumber('zero').value).toBe(0);
    expect(wordsToNumber('twenty-five').value).toBe(25);
    expect(wordsToNumber('forty two').value).toBe(42);
  });

  it('parses compound phrases', () => {
    expect(wordsToNumber('twelve thousand three hundred forty-five').value).toBe(12345);
    expect(wordsToNumber('one hundred five').value).toBe(105);
    expect(
      wordsToNumber('one million two hundred thirty-four thousand five hundred sixty-seven').value
    ).toBe(1234567);
    expect(wordsToNumber('two billion five hundred million').value).toBe(2500000000);
    expect(wordsToNumber('one trillion').value).toBe(1_000_000_000_000);
  });

  it('accepts optional and, case and extra whitespace', () => {
    expect(wordsToNumber('One Hundred and Five').value).toBe(105);
    expect(wordsToNumber('  TWELVE  thousand ').value).toBe(12000);
    expect(wordsToNumber('minus seven').value).toBe(-7);
    expect(wordsToNumber('negative three point five'.replace(' point five', '')).value).toBe(-3);
  });

  it('rejects malformed input', () => {
    expect(wordsToNumber('').error).toBeTruthy();
    expect(wordsToNumber('   ').error).toBeTruthy();
    expect(wordsToNumber('hello world').error).toBeTruthy();
    expect(wordsToNumber('twelve banana').error).toBeTruthy();
    expect(wordsToNumber('hundred').error).toBeTruthy();
    expect(wordsToNumber('thousand').error).toBeTruthy();
    expect(wordsToNumber('negative').error).toBeTruthy();
    expect(wordsToNumber('five hundred hundred').error).toBeTruthy();
    expect(wordsToNumber('million one').error).toBeTruthy();
  });
});

describe('ordinals', () => {
  it('converts correct ordinal words', () => {
    expect(integerToOrdinal(1)).toBe('first');
    expect(integerToOrdinal(2)).toBe('second');
    expect(integerToOrdinal(3)).toBe('third');
    expect(integerToOrdinal(4)).toBe('fourth');
    expect(integerToOrdinal(11)).toBe('eleventh');
    expect(integerToOrdinal(12)).toBe('twelfth');
    expect(integerToOrdinal(20)).toBe('twentieth');
    expect(integerToOrdinal(21)).toBe('twenty-first');
    expect(integerToOrdinal(100)).toBe('one hundredth');
    expect(integerToOrdinal(101)).toBe('one hundred first');
    expect(integerToOrdinal(1234)).toBe('one thousand two hundred thirty-fourth');
    expect(integerToOrdinal(0)).toBe('zeroth');
    expect(integerToOrdinal(-5)).toBe('negative fifth');
  });

  it('numeral ordinals use correct suffixes', () => {
    expect(numeralOrdinal(1)).toBe('1st');
    expect(numeralOrdinal(2)).toBe('2nd');
    expect(numeralOrdinal(3)).toBe('3rd');
    expect(numeralOrdinal(4)).toBe('4th');
    expect(numeralOrdinal(11)).toBe('11th');
    expect(numeralOrdinal(21)).toBe('21st');
    expect(numeralOrdinal(112)).toBe('112th');
  });

  it('ordinal suffix rules', () => {
    expect(ordinalSuffix(13)).toBe('th');
    expect(ordinalSuffix(111)).toBe('th');
    expect(ordinalSuffix(22)).toBe('nd');
  });
});

describe('currencyToWords', () => {
  it('formats check-style text', () => {
    expect(currencyToWords('1234.56', false).text).toBe(
      'one thousand two hundred thirty-four dollars and 56/100'
    );
    expect(currencyToWords('0.05', false).text).toBe('zero dollars and 05/100');
    expect(currencyToWords('1', false).text).toBe('one dollar and 00/100');
    expect(currencyToWords('100', false).text).toBe('one hundred dollars and 00/100');
    expect(currencyToWords('1234.56', true).text).toBe(
      'One Thousand Two Hundred Thirty-Four Dollars And 56/100'
    );
    expect(currencyToWords('$1,234.56', false).text).toBe(
      'one thousand two hundred thirty-four dollars and 56/100'
    );
  });

  it('rejects invalid amounts', () => {
    expect(currencyToWords('', false).error).toBeTruthy();
    expect(currencyToWords('abc', false).error).toBeTruthy();
    expect(currencyToWords('1.2.3', false).error).toBeTruthy();
    expect(currencyToWords('100000000000000', false).error).toBeTruthy();
  });
});

describe('convert (state entry point)', () => {
  it('converts number-to-words by default', () => {
    expect(convert(state({ input: '12345' })).primary).toBe(
      'twelve thousand three hundred forty-five'
    );
  });

  it('converts words-to-number and shows formatted secondary', () => {
    const result = convert(
      state({ input: 'twelve thousand three hundred forty-five', direction: 'words-to-number' })
    );
    expect(result.primary).toBe('12345');
    expect(result.secondary).toBe('12,345');
  });

  it('reports errors from either direction', () => {
    expect(convert(state({ input: 'xyz' })).error).toBeTruthy();
    expect(convert(state({ input: 'xyz', direction: 'words-to-number' })).error).toBeTruthy();
  });

  it('handles currency mode', () => {
    expect(convert(state({ input: '1234.56', currencyMode: true })).primary).toBe(
      'one thousand two hundred thirty-four dollars and 56/100'
    );
  });

  it('handles ordinal mode', () => {
    const result = convert(state({ input: '21', ordinalMode: true }));
    expect(result.primary).toBe('twenty-first');
    expect(result.secondary).toBe('21st');
  });

  it('handles negative and decimal numbers through state', () => {
    expect(convert(state({ input: '-3.5' })).primary).toBe('negative three point five');
  });
});

describe('tool definition', () => {
  it('serializes and deserializes state', () => {
    const serialized = wordNumberTool.serialize(state({ input: 'seven' }));
    expect(serialized).toContain('"input":"seven"');
    const deserialized = wordNumberTool.deserialize(JSON.parse(serialized));
    expect(deserialized.success).toBe(true);
    if (deserialized.success) {
      expect(deserialized.data).toEqual(state({ input: 'seven' }));
    }
  });

  it('fills missing optional fields and rejects invalid payloads', () => {
    const ok = wordNumberTool.deserialize({ input: 'x', direction: 'words-to-number' });
    expect(ok).toEqual({
      success: true,
      data: {
        input: 'x',
        direction: 'words-to-number',
        format: 'lower',
        currencyMode: false,
        ordinalMode: false,
      },
    });
    expect(wordNumberTool.deserialize('nope').success).toBe(false);
    expect(wordNumberTool.deserialize(null).success).toBe(false);
    expect(wordNumberTool.deserialize({ input: 'x', direction: 'sideways' }).success).toBe(false);
    expect(wordNumberTool.deserialize({ direction: 'words-to-number' }).success).toBe(false);
  });

  it('keeps default state stable and exposes exporters', () => {
    expect(DEFAULT_STATE.direction).toBe('number-to-words');
    expect(wordNumberTool.exporters).toHaveLength(4);
  });
});

describe('tokenizeWords', () => {
  it('splits hyphens, commas and whitespace', () => {
    expect(tokenizeWords('Forty-Two, Thousand')).toEqual(['forty', 'two', 'thousand']);
  });
});
