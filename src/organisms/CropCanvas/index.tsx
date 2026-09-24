'use client';

import type { CropView } from '~/utils/computeCropRect';
import type { Ratio, Size } from '~/utils/geometry';

import { CropCanvasView } from './components/CropCanvasView';
import { useCropCanvas } from './hooks/useCropCanvas';

export type CropCanvasProps = {
  imageName: string;
  imageSrc: string;
  naturalSize: Size;
  ratio: Ratio;
  view: CropView;
  onViewChange: (view: CropView) => void;
};

/**
 * An interactive pan-and-zoom crop of one image to a target ratio — drag or
 * scroll with a mouse, drag or pinch on touch. Fully controlled —
 * `view`/`onViewChange` — so it stores nothing itself and can be driven
 * from a store (as `EditorTemplate` does) or from local state (as its own
 * stories do).
 */
export const CropCanvas = ({
  imageName,
  imageSrc,
  naturalSize,
  ratio,
  view,
  onViewChange,
}: CropCanvasProps) => {
  const { containerRef, displayStyle, frameHandlers } = useCropCanvas({
    source: naturalSize,
    ratio,
    view,
    onViewChange,
  });

  return (
    <CropCanvasView
      imageName={imageName}
      imageSrc={imageSrc}
      displayStyle={displayStyle}
      frameRef={containerRef}
      frameHandlers={frameHandlers}
    />
  );
};
