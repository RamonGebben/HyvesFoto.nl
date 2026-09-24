'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { clamp } from '~/utils/clamp';
import { computeCropRect, MAX_ZOOM, MIN_ZOOM } from '~/utils/computeCropRect';
import type { CropView } from '~/utils/computeCropRect';
import { isPositiveSize } from '~/utils/geometry';
import type { Point, Ratio, Rect, Size } from '~/utils/geometry';

export type ImageDisplayStyle = {
  /** The full image's width, as a percentage of the crop container's width. */
  readonly widthPercent: number;
  /** The image's left offset, as a percentage of the container's width. */
  readonly leftPercent: number;
  /** The image's top offset, as a percentage of the container's height. */
  readonly topPercent: number;
};

/**
 * Where to position and size the full image inside its crop container, so
 * that `cropRect` exactly fills it — expressed as CSS percentages, which
 * stay correct at any container size without measuring the DOM.
 */
export const computeImageDisplayStyle = (
  source: Size,
  cropRect: Rect,
): ImageDisplayStyle => {
  if (!isPositiveSize(source)) {
    throw new Error(
      `Invalid source size: ${source.width}x${source.height}. Both sides must be finite and positive.`,
    );
  }

  if (!(cropRect.width > 0) || !(cropRect.height > 0)) {
    throw new Error(
      `Invalid crop rect: ${cropRect.width}x${cropRect.height}. Both sides must be positive.`,
    );
  }

  return {
    widthPercent: (source.width / cropRect.width) * 100,
    // `+ 0` normalises a `-0` result (when cropRect.x/y is exactly 0) to a
    // plain `0`, so callers never see a cosmetic "-0%" in devtools.
    leftPercent: (-cropRect.x / cropRect.width) * 100 + 0,
    topPercent: (-cropRect.y / cropRect.height) * 100 + 0,
  };
};

/**
 * How far a screen-space drag moves the crop, in source image pixels —
 * dividing out the container's current display scale.
 */
export const screenDeltaToSourceDelta = (
  cropRect: Rect,
  containerWidthPx: number,
  screenDelta: Point,
): Point => {
  if (!Number.isFinite(containerWidthPx) || containerWidthPx <= 0) {
    throw new Error(`Invalid container width: ${containerWidthPx}.`);
  }

  const sourcePxPerScreenPx = cropRect.width / containerWidthPx;
  return {
    x: screenDelta.x * sourcePxPerScreenPx,
    y: screenDelta.y * sourcePxPerScreenPx,
  };
};

export const pointDistance = (a: Point, b: Point): number =>
  Math.hypot(b.x - a.x, b.y - a.y);

export const pointMidpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const WHEEL_ZOOM_SENSITIVITY = 0.0025;

type UseCropCanvasOptions = {
  readonly source: Size;
  readonly ratio: Ratio;
  readonly view: CropView;
  readonly onViewChange: (view: CropView) => void;
};

/**
 * Thin wrapper around the pure geometry above: wires pointer drag/pinch and
 * wheel zoom to `onViewChange`, and derives the CSS the view needs to
 * render.
 */
export const useCropCanvas = ({
  source,
  ratio,
  view,
  onViewChange,
}: UseCropCanvasOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Every currently-down pointer's last known screen position. One entry ->
  // single-finger/mouse pan; two entries -> pinch (zoom from the distance
  // between them, pan from their midpoint).
  const pointsRef = useRef<Map<number, Point>>(new Map());

  const cropRect = useMemo(
    () => computeCropRect(source, ratio, view),
    [source, ratio, view],
  );

  const displayStyle = useMemo(
    () => computeImageDisplayStyle(source, cropRect),
    [source, cropRect],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      pointsRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const points = pointsRef.current;
      const previous = points.get(event.pointerId);
      const containerWidthPx =
        containerRef.current?.getBoundingClientRect().width;

      if (!previous || !containerWidthPx) return;

      const current = { x: event.clientX, y: event.clientY };
      points.set(event.pointerId, current);

      const otherId = Array.from(points.keys()).find(
        id => id !== event.pointerId,
      );
      const other = otherId !== undefined ? points.get(otherId) : undefined;

      if (other) {
        // Pinch: zoom from the change in finger distance, pan from the
        // midpoint's movement, both relative to just this pointer's move
        // (the other finger's own move fires its own event and does the
        // same, so a real pinch smoothly combines both fingers' motion).
        const previousDistance = pointDistance(previous, other);
        const currentDistance = pointDistance(current, other);
        if (!(previousDistance > 0)) return;

        const zoom = clamp(
          view.zoom * (currentDistance / previousDistance),
          MIN_ZOOM,
          MAX_ZOOM,
        );

        const screenDelta = {
          x: pointMidpoint(current, other).x - pointMidpoint(previous, other).x,
          y: pointMidpoint(current, other).y - pointMidpoint(previous, other).y,
        };
        const sourceDelta = screenDeltaToSourceDelta(
          cropRect,
          containerWidthPx,
          screenDelta,
        );

        onViewChange({
          zoom,
          center: {
            x: view.center.x - sourceDelta.x,
            y: view.center.y - sourceDelta.y,
          },
        });
        return;
      }

      const screenDelta = {
        x: current.x - previous.x,
        y: current.y - previous.y,
      };
      const sourceDelta = screenDeltaToSourceDelta(
        cropRect,
        containerWidthPx,
        screenDelta,
      );

      // Dragging the image right reveals content to the left, so the focus
      // point moves opposite the pointer.
      onViewChange({
        zoom: view.zoom,
        center: {
          x: view.center.x - sourceDelta.x,
          y: view.center.y - sourceDelta.y,
        },
      });
    },
    [cropRect, onViewChange, view.center, view.zoom],
  );

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pointsRef.current.delete(event.pointerId);
  }, []);

  // A native, non-passive listener: React's onWheel is passive by default,
  // so calling event.preventDefault() there does not actually stop the page
  // from scrolling while the user zooms an image with their scroll wheel.
  const latestRef = useRef({ view, onViewChange });
  useEffect(() => {
    latestRef.current = { view, onViewChange };
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleWheelNative = (event: WheelEvent) => {
      event.preventDefault();
      const { view: latestView, onViewChange: latestOnViewChange } =
        latestRef.current;
      const zoom = clamp(
        latestView.zoom - event.deltaY * WHEEL_ZOOM_SENSITIVITY,
        MIN_ZOOM,
        MAX_ZOOM,
      );
      latestOnViewChange({ zoom, center: latestView.center });
    };

    element.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => element.removeEventListener('wheel', handleWheelNative);
  }, []);

  return {
    containerRef,
    displayStyle,
    frameHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
};
