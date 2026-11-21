'use client';

import React from 'react';
import type { ToolState, WordsFormat } from '../types';

interface SidebarProps {
  state: ToolState;
  onChange: (state: ToolState) => void;
}

const FORMAT_LABELS: { value: WordsFormat; label: string }[] = [
  { value: 'lower', label: 'lowercase' },
  { value: 'title', label: 'Title Case' },
  { value: 'commas', label: 'Comma groups' },
];

const EXAMPLES_NUMBER = ['12345', '-3.5', '0.75', '1000000', '999999999999999'];
const EXAMPLES_WORDS = [
  'twelve thousand three hundred forty-five',
  'negative three point five',
  'one million',
  'twenty-five',
];

export const Sidebar: React.FC<SidebarProps> = ({ state, onChange }) => {
  const update = (patch: Partial<ToolState>) => onChange({ ...state, ...patch });
  const isWords = state.direction === 'words-to-number';

  return (
    <div className="p-4 space-y-6 text-sm overflow-y-auto h-full" data-testid="word-number-sidebar">
      <div>
        <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">Word format</h3>
        <div className="flex flex-wrap gap-2">
          {FORMAT_LABELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => update({ format: value })}
              aria-pressed={state.format === value}
              data-testid={`format-${value}`}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                state.format === value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">Examples</h3>
        <div className="flex flex-wrap gap-1.5">
          {(isWords ? EXAMPLES_WORDS : EXAMPLES_NUMBER).map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => update({ input: example })}
              className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">About</h3>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          Numbers convert with US short-scale naming up to trillions. Words-to-number accepts
          hyphenated words, optional &quot;and&quot;, and &quot;negative&quot;/&quot;minus&quot;
          signs. Currency mode writes amounts check-style with cents as a fraction of 100.
          Ordinal mode outputs words like &quot;twenty-first&quot; and the numeral form
          &quot;21st&quot;.
        </p>
      </div>
    </div>
  );
};
