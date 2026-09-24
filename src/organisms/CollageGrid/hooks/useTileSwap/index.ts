'use client';

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useCallback, useState } from 'react';

export type TileSwapEvent = {
  readonly active: { readonly id: string | number };
  readonly over: { readonly id: string | number } | null;
};

export type TileSwap = { readonly fromId: string; readonly toId: string };

/**
 * Which two tiles to swap, given a finished drag — or `null` if it landed
 * back on itself or outside any tile. Pure, so the id-extraction logic is
 * testable without a real dnd-kit drag.
 */
export const resolveSwapTarget = (event: TileSwapEvent): TileSwap | null => {
  const fromId = String(event.active.id);
  const toId = event.over ? String(event.over.id) : null;

  if (!toId || toId === fromId) {
    return null;
  }

  return { fromId, toId };
};

export type UseTileSwapOptions = {
  readonly onSwap: (fromId: string, toId: string) => void;
};

/**
 * Thin wrapper around dnd-kit: wires drag lifecycle events to `onSwap`, and
 * tracks which tile is actively being dragged so callers can disable other
 * tiles' controls for the duration (removing an image mid-drag would leave
 * dnd-kit tracking a node that no longer exists).
 */
export const useTileSwap = ({ onSwap }: UseTileSwapOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const swap = resolveSwapTarget(event);
      if (swap) {
        onSwap(swap.fromId, swap.toId);
      }
    },
    [onSwap],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
