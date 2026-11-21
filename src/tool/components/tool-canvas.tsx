'use client';

import { useCallback } from 'react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import type { ToolState } from '../types';

interface ToolCanvasProps {
  state: ToolState;
  fontSize: number;
  readOnly?: boolean;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  onStateChange?: (updater: (prev: ToolState) => ToolState) => void;
  onClear?: () => void;
}

export function ToolCanvas({
  state,
  fontSize,
  readOnly = false,
  canvasRef,
  onStateChange,
  onClear,
}: ToolCanvasProps) {
  const handleChange = useCallback(
    (next: ToolState) => {
      onStateChange?.(() => next);
    },
    [onStateChange]
  );

  return (
    <div
      ref={canvasRef}
      className="converter-canvas"
      role="application"
      aria-label="Word to number converter canvas"
      style={{ fontSize: `${fontSize}px` }}
    >
      {onClear ? <Toolbar state={state} onChange={handleChange} onClear={onClear} /> : null}
      <Canvas state={state} onChange={handleChange} />
      {readOnly ? null : null}
    </div>
  );
}
