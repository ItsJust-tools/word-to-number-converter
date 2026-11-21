'use client';

import React from 'react';
import type { Direction, ToolState } from '../types';

interface ToolbarProps {
  state: ToolState;
  onChange: (state: ToolState) => void;
  onClear: () => void;
}

const DIRECTION_LABELS: { value: Direction; label: string }[] = [
  { value: 'number-to-words', label: 'Number → Words' },
  { value: 'words-to-number', label: 'Words → Number' },
];

export const Toolbar: React.FC<ToolbarProps> = ({ state, onChange, onClear }) => {
  const swap = React.useCallback(() => {
    onChange({
      ...state,
      direction: state.direction === 'number-to-words' ? 'words-to-number' : 'number-to-words',
    });
  }, [state, onChange]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-1" role="group" aria-label="Conversion direction">
        {DIRECTION_LABELS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange({ ...state, direction: value })}
            aria-pressed={state.direction === value}
            data-testid={`direction-${value}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              state.direction === value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={swap}
          data-testid="swap-direction"
          aria-label="Swap conversion direction"
          className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ⇄ Swap
        </button>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={state.currencyMode}
            onChange={(e) => onChange({ ...state, currencyMode: e.target.checked })}
            data-testid="currency-mode"
            className="h-3.5 w-3.5"
          />
          Currency ($ check style)
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={state.ordinalMode}
            onChange={(e) => onChange({ ...state, ordinalMode: e.target.checked })}
            data-testid="ordinal-mode"
            className="h-3.5 w-3.5"
          />
          Ordinal
        </label>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
