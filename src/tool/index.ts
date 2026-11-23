export { default as toolConfig } from './tool.config';
export { templateBaseVersion } from './template-metadata';
export { templateMetadata, getPublicSiteUrl } from './template-metadata';
export {
  wordNumberTool,
  convert,
  numberToWordsText,
  wordsToNumber,
  tokenizeWords,
  integerToWords,
  integerToOrdinal,
  numeralOrdinal,
  ordinalSuffix,
  currencyToWords,
  MAX_SAFE_WORDS_INTEGER,
} from './tool-definition';
export { ToolCanvas } from './components/tool-canvas';
export { ToolToolbar } from './components/tool-toolbar';
export { ToolSidebar } from './components/tool-sidebar';
export { Canvas } from './components/Canvas';
export { Sidebar } from './components/Sidebar';
export { Toolbar } from './components/Toolbar';
export type { ToolState, Direction, WordsFormat, ConversionResult } from './types';
