'use client';

import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';
import styled from 'styled-components';

import { mobileAspectRatio } from '~/content/aspectRatios';
import { MobileSafeZoneOverlay } from '~/molecules/MobileSafeZoneOverlay';
import { CropCanvas } from '~/organisms/CropCanvas';
import type { CropView } from '~/utils/computeCropRect';
import type { Ratio, Size } from '~/utils/geometry';
import type { CollageTile as CollageTileData } from '~/utils/resolveCollageTiles';

import { CollageTile } from './components/CollageTile';
import { useTileSwap } from './hooks/useTileSwap';

/**
 * Sized to the full desktop output ratio — `GridFrame` and
 * `MobileSafeZoneOverlay` are both absolutely-positioned children sharing
 * this exact box, so the overlay's tick marks can extend past `GridFrame`'s
 * own `overflow: hidden` clip instead of being cut off by it.
 *
 * `z-index: 0` makes this its own stacking context, so the overlay
 * (`zIndex.canvasOverlay`) and each tile's `TopBar`
 * (`zIndex.tileControls`, higher, so its buttons never sit under the
 * overlay's tint) only stack against each other here, not against unrelated
 * z-indexed elements elsewhere on the page.
 */
const GridFrameWrapper = styled.div<{ $ratio: number }>`
  position: relative;
  z-index: 0;
  width: 100%;
  aspect-ratio: ${props => props.$ratio};
`;

const GridFrame = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${props => props.theme.radius.lg};
  overflow: hidden;
  background: ${props => props.theme.color.canvas};
`;

const FocusEditor = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.md};
  padding: ${props => props.theme.space.md};
  background: ${props => props.theme.color.modalBackdrop};
  color: ${props => props.theme.color.darkContrast};
`;

const FocusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 48rem);
  gap: ${props => props.theme.space.md};
`;

const FocusTitle = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FocusCanvas = styled.div<{ $ratio: number }>`
  width: min(100%, 48rem);
  max-height: 76vh;
  aspect-ratio: ${props => props.$ratio};
  overflow: hidden;
  border-radius: ${props => props.theme.radius.md};
`;

const FocusButton = styled.button`
  min-height: 44px;
  padding: 0 ${props => props.theme.space.md};
  border: 1px solid ${props => props.theme.color.modalControlBorder};
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => props.theme.color.modalControlBg};
  color: ${props => props.theme.color.darkContrast};
  font: inherit;
  cursor: pointer;
`;

export type CollageGridImage = {
  readonly id: string;
  readonly name: string;
  readonly previewUrl: string;
  readonly naturalSize?: Size;
  readonly cropView?: CropView;
};

export type CollageGridProps = {
  /** Positionally paired with `tiles` — both share the same order. */
  readonly images: readonly CollageGridImage[];
  readonly tiles: readonly CollageTileData[];
  readonly outputRatio: Ratio;
  /** How visible the mobile safe-zone guide is, from 0 (hidden) to 1 (full). */
  readonly mobileGuideOpacity: number;
  readonly onCropViewChange: (id: string, view: CropView) => void;
  readonly onRemoveImage: (id: string) => void;
  readonly onSwapImages: (fromId: string, toId: string) => void;
  readonly isExporting: boolean;
};

/**
 * One magazine-style grid: every uploaded image is a tile, independently
 * pannable/zoomable, swappable by dragging its handle onto another tile.
 *
 * Fully controlled — `tiles` come pre-resolved from `resolveCollageTiles` —
 * so it stays presentational and Storybook-drivable, matching how
 * `CropCanvas`/`ImageDropzone` are controlled organisms embedded directly
 * inside `EditorTemplate`.
 */
export const CollageGrid = ({
  images,
  tiles,
  outputRatio,
  mobileGuideOpacity,
  onCropViewChange,
  onRemoveImage,
  onSwapImages,
  isExporting,
}: CollageGridProps) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useTileSwap({ onSwap: onSwapImages });

  return (
    <DndContext
      sensors={sensors}
      // All tiles already sit inside one visible grid frame — there's no
      // content below/above worth scrolling to reach. Without this, dnd-kit
      // auto-scrolls the page when the pointer nears the viewport edge
      // (common on a phone screen), which yanks the drop target out from
      // under the finger mid-drag.
      autoScroll={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <GridFrameWrapper $ratio={outputRatio.width / outputRatio.height}>
        <GridFrame>
          {images.map((image, index) => {
            const tile = tiles[index];
            if (!tile) return null;

            return (
              <CollageTile
                key={image.id}
                id={image.id}
                name={image.name}
                previewUrl={image.previewUrl}
                naturalSize={image.naturalSize}
                cropView={image.cropView}
                ratio={tile.ratio}
                rect={tile.rect}
                onCropViewChange={view => onCropViewChange(image.id, view)}
                onFocus={() => setFocusedId(image.id)}
                onRemove={() => onRemoveImage(image.id)}
                isExporting={isExporting}
                isDragActive={activeId !== null}
              />
            );
          })}
        </GridFrame>
        <MobileSafeZoneOverlay
          desktopRatio={outputRatio}
          mobileRatio={mobileAspectRatio}
          opacity={mobileGuideOpacity}
        />
      </GridFrameWrapper>
      {(() => {
        const focusedIndex = images.findIndex(image => image.id === focusedId);
        const focusedImage = images[focusedIndex];
        const focusedTile = tiles[focusedIndex];
        if (
          !focusedImage ||
          !focusedTile ||
          !focusedImage.naturalSize ||
          !focusedImage.cropView
        )
          return null;

        return (
          <FocusEditor
            role="dialog"
            aria-modal="true"
            aria-label={`Bewerk ${focusedImage.name}`}
            onKeyDown={event => {
              if (event.key === 'Escape') setFocusedId(null);
            }}
          >
            <FocusHeader>
              <FocusTitle>{focusedImage.name}</FocusTitle>
              <FocusButton
                type="button"
                autoFocus
                onClick={() => setFocusedId(null)}
              >
                Klaar
              </FocusButton>
            </FocusHeader>
            <FocusCanvas
              $ratio={focusedTile.ratio.width / focusedTile.ratio.height}
            >
              <CropCanvas
                imageName={focusedImage.name}
                imageSrc={focusedImage.previewUrl}
                naturalSize={focusedImage.naturalSize}
                ratio={focusedTile.ratio}
                view={focusedImage.cropView}
                onViewChange={view => onCropViewChange(focusedImage.id, view)}
              />
            </FocusCanvas>
            <p>Knijp om in te zoomen en sleep om de uitsnede te verplaatsen.</p>
          </FocusEditor>
        );
      })()}
    </DndContext>
  );
};
