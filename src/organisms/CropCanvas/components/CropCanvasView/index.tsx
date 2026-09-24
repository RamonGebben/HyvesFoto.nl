'use client';

import styled from 'styled-components';

import type { ImageDisplayStyle } from '~/organisms/CropCanvas/hooks/useCropCanvas';

/**
 * Fills whatever size its parent gives it — sizing comes entirely from the
 * caller: an aspect-ratio'd container for a standalone crop, or a
 * percentage-positioned grid tile wrapper for one tile of a collage.
 *
 * Deliberately has no border-radius of its own: a rounded corner on every
 * tile would show up between adjacent tiles too. Only the outer edge of the
 * whole grid (or a standalone crop's own wrapper) is ever rounded.
 */
const Frame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${props => props.theme.color.canvas};
  /* Otherwise a touch drag/pinch also scrolls or zooms the page. */
  touch-action: none;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color.focus};
    outline-offset: 2px;
  }
`;

const CroppedImage = styled.img<{
  $width: number;
  $left: number;
  $top: number;
}>`
  position: absolute;
  width: ${props => props.$width}%;
  /* No intrinsic max-width here — the global reset caps images at 100% of
     their container, which is exactly what this needs to override. */
  max-width: none;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  user-select: none;
  -webkit-user-drag: none;
  /* The Frame owns pointer handling; the image must not intercept it. */
  pointer-events: none;
`;

export type CropCanvasViewProps = {
  imageName: string;
  imageSrc: string;
  displayStyle: ImageDisplayStyle;
  frameRef: React.Ref<HTMLDivElement>;
  frameHandlers: React.HTMLAttributes<HTMLDivElement>;
};

export const CropCanvasView = ({
  imageName,
  imageSrc,
  displayStyle,
  frameRef,
  frameHandlers,
}: CropCanvasViewProps) => (
  <Frame
    ref={frameRef}
    role="group"
    aria-label={`Uitsnede van ${imageName}, sleep of scroll om te verschuiven en te zoomen`}
    {...frameHandlers}
  >
    <CroppedImage
      src={imageSrc}
      alt={imageName}
      draggable={false}
      $width={displayStyle.widthPercent}
      $left={displayStyle.leftPercent}
      $top={displayStyle.topPercent}
    />
  </Frame>
);
