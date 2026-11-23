export type WordsFormat =
  | 'lower'
  | 'title'
  /* comma-separated scale groups */
  | 'commas';

export type Direction = 'number-to-words' | 'words-to-number';

export interface ToolState {
  /** Text typed in the active direction's input. */
  input: string;
  /** Active conversion direction. */
  direction: Direction;
  /** Word formatting style for number-to-words output. */
  format: WordsFormat;
  /** Currency (check writing) mode for number-to-words. */
  currencyMode: boolean;
  /** Ordinal output mode for number-to-words (integer part only). */
  ordinalMode: boolean;
}

export const DEFAULT_STATE: ToolState = {
  input: '12345',
  direction: 'number-to-words',
  format: 'lower',
  currencyMode: false,
  ordinalMode: false,
};

export const MAX_SAFE_WORDS_INTEGER = 999_999_999_999_999;

/** Result of converting the current input in the active direction. */
export interface ConversionResult {
  primary: string;
  secondary: string | null;
  error: string | null;
}
