'use client';

import { DndContext } from '@dnd-kit/core';
import styled from 'styled-components';

import type { CropView } from '~/utils/computeCropRect';
import type { Ratio, Size } from '~/utils/geometry';
import type { CollageTile as CollageTileData } from '~/utils/resolveCollageTiles';

import { CollageTile } from './components/CollageTile';
import { useTileSwap } from './hooks/useTileSwap';

const GridFrame = styled.div<{ $ratio: number }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${props => props.$ratio};
  border-radius: ${props => props.theme.radius.lg};
  overflow: hidden;
  background: ${props => props.theme.color.canvas};
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
  onCropViewChange,
  onRemoveImage,
  onSwapImages,
  isExporting,
}: CollageGridProps) => {
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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <GridFrame $ratio={outputRatio.width / outputRatio.height}>
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
              onRemove={() => onRemoveImage(image.id)}
              isExporting={isExporting}
              isDragActive={activeId !== null}
            />
          );
        })}
      </GridFrame>
    </DndContext>
  );
};
