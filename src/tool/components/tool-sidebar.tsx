'use client';

import { Sidebar } from './Sidebar';
import type { ToolState } from '../types';

interface ToolSidebarProps {
  state?: ToolState;
  onStateChange?: (updater: (prev: ToolState) => ToolState) => void;
  text?: string;
  fontSize?: number;
  onFontSizeChange?: (delta: number) => void;
}

export function ToolSidebar({ state, onStateChange, text, fontSize, onFontSizeChange }: ToolSidebarProps) {
  const digits = (text ?? '').replace(/\s/g, '').length;

  return (
    <div className="converter-sidebar">
      {state && onStateChange ? (
        <Sidebar state={state} onChange={(next) => onStateChange(() => next)} />
      ) : (
        <div className="sidebar-section">
          <h3>Input Stats</h3>
          <dl className="stats-list">
            <div className="stat-row">
              <dt>Characters</dt>
              <dd>{digits.toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      )}
      <div className="sidebar-section">
        <h3>Font size</h3>
        <p>
          <button
            type="button"
            aria-label="Decrease font size"
            onClick={() => onFontSizeChange?.(-2)}
            className="mr-2 rounded border border-gray-300 px-2 text-xs dark:border-gray-700"
          >
            A-
          </button>
          <span className="font-mono text-xs">{fontSize ?? 16}px</span>
          <button
            type="button"
            aria-label="Increase font size"
            onClick={() => onFontSizeChange?.(2)}
            className="ml-2 rounded border border-gray-300 px-2 text-xs dark:border-gray-700"
          >
            A+
          </button>
        </p>
      </div>
    </div>
  );
}
