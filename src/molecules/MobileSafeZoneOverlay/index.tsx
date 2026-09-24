'use client';

import styled from 'styled-components';

import { computeMobileCutoff } from '~/utils/computeMobileCutoff';
import type { Ratio } from '~/utils/geometry';

const TICK_LENGTH = '10px';
const TICK_GAP = '4px';
const TICK_THICKNESS = '2px';
const TICK_HALF_THICKNESS = '1px';

const Root = styled.div<{ $opacity: number }>`
  position: absolute;
  inset: 0;
  z-index: ${props => props.theme.zIndex.canvasOverlay};
  opacity: ${props => props.$opacity};
  pointer-events: none;
`;

/** Clipped to the canvas's own rounded corners, same as `GridFrame`. */
const Shutters = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: ${props => props.theme.radius.lg};
`;

const Shutter = styled.div<{
  $side: 'left' | 'right';
  $widthPercent: number;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${props => props.$widthPercent}%;
  ${props => props.$side}: 0;
  background: ${props => props.theme.color.overlay};
`;

/** Deliberately not clipped — sits just outside the image edge. */
const Tick = styled.div<{
  $side: 'left' | 'right';
  $edge: 'top' | 'bottom';
  $offsetPercent: number;
}>`
  position: absolute;
  width: ${TICK_THICKNESS};
  height: ${TICK_LENGTH};
  background: ${props => props.theme.color.overlay};
  ${props => `
    ${props.$edge}: calc(-${TICK_LENGTH} - ${TICK_GAP});
    ${props.$side}: calc(${props.$offsetPercent}% - ${TICK_HALF_THICKNESS});
  `}
`;

export type MobileSafeZoneOverlayProps = {
  /** The ratio the crop is currently framed for (the wider, leading one). */
  readonly desktopRatio: Ratio;
  /** The narrower ratio mobile additionally hard-crops to. */
  readonly mobileRatio: Ratio;
  /** 0 (hidden) to 1 (fully visible). */
  readonly opacity: number;
};

/**
 * A guide overlaid on the crop/collage canvas: semi-transparent shutters plus
 * registration-mark ticks showing how much of `desktopRatio`'s frame mobile
 * would additionally cut from the left/right.
 */
export const MobileSafeZoneOverlay = ({
  desktopRatio,
  mobileRatio,
  opacity,
}: MobileSafeZoneOverlayProps) => {
  const { leftPercent, rightPercent } = computeMobileCutoff(
    desktopRatio,
    mobileRatio,
  );

  return (
    <Root aria-hidden="true" $opacity={opacity}>
      <Shutters>
        <Shutter $side="left" $widthPercent={leftPercent} />
        <Shutter $side="right" $widthPercent={rightPercent} />
      </Shutters>
      <Tick $side="left" $edge="top" $offsetPercent={leftPercent} />
      <Tick $side="left" $edge="bottom" $offsetPercent={leftPercent} />
      <Tick $side="right" $edge="top" $offsetPercent={rightPercent} />
      <Tick $side="right" $edge="bottom" $offsetPercent={rightPercent} />
    </Root>
  );
};
