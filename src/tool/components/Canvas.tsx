'use client';

import React from 'react';
import { convert } from '../tool-definition';
import type { ToolState } from '../types';

interface CanvasProps {
  state: ToolState;
  onChange: (state: ToolState) => void;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; ignore
    }
  }, [value]);
  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className="copy-btn text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
      aria-label={`Copy ${label}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

const PLACEHOLDERS: Record<string, string> = {
  'number-to-words': 'e.g. 12345 or -3.5',
  'words-to-number': 'e.g. twelve thousand three hundred forty-five',
};

export const Canvas: React.FC<CanvasProps> = ({ state, onChange }) => {
  const result = React.useMemo(() => convert(state), [state]);
  const isWords = state.direction === 'words-to-number';

  return (
    <div className="p-6 space-y-6" data-testid="word-number-canvas">
      <div>
        <label
          htmlFor="converter-input"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {isWords ? 'Number words' : 'Number'}
        </label>
        <textarea
          id="converter-input"
          data-testid="converter-input"
          value={state.input}
          onChange={(e) => onChange({ ...state, input: e.target.value })}
          placeholder={PLACEHOLDERS[state.direction]}
          rows={2}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isWords ? 'Numeric value' : 'In words'}
          </span>
          {result.primary ? <CopyButton value={result.primary} label="result" /> : null}
        </div>
        <div
          data-testid="conversion-result"
          role="status"
          className={`min-h-16 rounded-md border px-3 py-2 text-base break-words ${
            result.error
              ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300'
              : 'border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
          }`}
        >
          {result.error ?? result.primary}
        </div>
        {result.secondary ? (
          <div className="mt-2 flex items-center justify-between gap-2">
            <span
              className="font-mono text-sm text-gray-600 dark:text-gray-400"
              data-testid="secondary-result"
            >
              {result.secondary}
            </span>
            <CopyButton value={result.secondary} label="formatted value" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
