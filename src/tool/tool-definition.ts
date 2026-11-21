import type { Tool, DeserializeResult } from '@itsjust/core';
import { DEFAULT_STATE, MAX_SAFE_WORDS_INTEGER, type ConversionResult, type Direction, type ToolState, type WordsFormat } from './types';
import { numberToWordsText, type WordsFormat as NumberTextFormat } from './number-text';
import { wordsToNumber } from './words-to-number';
import { integerToOrdinal, numeralOrdinal } from './ordinals';
import { currencyToWords } from './currency';

export { numberToWordsText } from './number-text';
import toolConfig from './tool.config';
export { wordsToNumber, tokenizeWords } from './words-to-number';
export { integerToWords } from './number-to-words';
export { integerToOrdinal, numeralOrdinal, ordinalSuffix } from './ordinals';
export { currencyToWords } from './currency';

const FORMATS: WordsFormat[] = ['lower', 'title', 'commas'];

function isDirection(value: unknown): value is Direction {
  return value === 'number-to-words' || value === 'words-to-number';
}

function isFormat(value: unknown): value is WordsFormat {
  return typeof value === 'string' && (FORMATS as string[]).includes(value);
}

/** Convert state input in the active direction into primary/secondary outputs. */
export function convert(state: ToolState): ConversionResult {
  const input = state.input.trim();

  if (state.direction === 'words-to-number') {
    const parsed = wordsToNumber(input);
    if (parsed.value === null) {
      return { primary: '', secondary: null, error: parsed.error };
    }
    const value = parsed.value;
    const withCommas = value.toLocaleString('en-US');
    return { primary: String(value), secondary: withCommas, error: null };
  }

  if (state.currencyMode) {
    const currency = currencyToWords(input, state.format === 'title');
    if (currency.error) {
      return { primary: '', secondary: null, error: currency.error };
    }
    return { primary: currency.text, secondary: null, error: null };
  }

  const result = numberToWordsText(input, state.format as NumberTextFormat);
  if (result.error) {
    return { primary: '', secondary: null, error: result.error };
  }

  if (state.ordinalMode) {
    const intValue = Number.parseInt(input.replace(/^[+-]/, '').split('.')[0] ?? '', 10);
    if (Number.isSafeInteger(intValue)) {
      const signed = input.trim().startsWith('-') ? -intValue : intValue;
      const ordinal = integerToOrdinal(signed);
      return {
        primary: ordinal ?? result.text,
        secondary: Number.isInteger(signed) ? numeralOrdinal(signed) : null,
        error: null,
      };
    }
  }

  return { primary: result.text, secondary: null, error: null };
}

export const wordNumberTool: Tool<ToolState> = {
  id: toolConfig.id,
  name: toolConfig.name,
  version: toolConfig.version,
  config: toolConfig,
  initialState: { ...DEFAULT_STATE },
  serialize: (state) => JSON.stringify(state),
  deserialize: (data): DeserializeResult<ToolState> => {
    if (typeof data !== 'object' || data === null) {
      return { success: false, error: 'Invalid data format: expected word-to-number state object' };
    }
    const v = data as Partial<ToolState>;
    if (typeof v.input !== 'string' || !isDirection(v.direction)) {
      return {
        success: false,
        error: 'Invalid data format: expected { input: string, direction: Direction, ... }',
      };
    }
    return {
      success: true,
      data: {
        input: v.input,
        direction: v.direction,
        format: isFormat(v.format) ? v.format : DEFAULT_STATE.format,
        currencyMode: typeof v.currencyMode === 'boolean' ? v.currencyMode : false,
        ordinalMode: typeof v.ordinalMode === 'boolean' ? v.ordinalMode : false,
      },
    };
  },
  exporters: [
    { format: 'png', loader: () => import('./exporters/png') },
    { format: 'jpeg', loader: () => import('./exporters/jpeg') },
    { format: 'webp', loader: () => import('./exporters/webp') },
    { format: 'pdf', loader: () => import('./exporters/pdf') },
  ],
};

export { MAX_SAFE_WORDS_INTEGER };
