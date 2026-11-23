import type { ToolConfig } from '@itsjust/core';

const toolConfig: ToolConfig = {
  id: 'tool-1795241052',
  name: 'Word to Number Converter',
  version: '1.0.0',
  description:
    'Convert numbers to English words (check writing style) and English word numbers back to numeric values.',
  exportFormats: ['png', 'pdf', 'json', 'jpeg', 'webp'] as ToolConfig['exportFormats'],
  theme: {
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentSubtle: 'rgba(245, 158, 11, 0.12)',
    brand: 'Word to Number Converter',
    icon: '\u{1F522}',
  },
  features: {
    export: true,
    autoSave: true,
    undoRedo: true,
    sidebar: true,
    statusBar: true,
    darkMode: true,
  },
};

export default toolConfig;

export type ToolConfigType = typeof toolConfig;
