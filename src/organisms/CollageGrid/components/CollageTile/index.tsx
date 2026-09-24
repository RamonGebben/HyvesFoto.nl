'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Maximize2 } from 'lucide-react';
import styled from 'styled-components';

import { CropCanvas } from '~/organisms/CropCanvas';
import type { CropView } from '~/utils/computeCropRect';
import type { Ratio, Rect, Size } from '~/utils/geometry';

const TileBox = styled.div<{ $rect: Rect }>`
  position: absolute;
  left: ${props => props.$rect.x * 100}%;
  top: ${props => props.$rect.y * 100}%;
  width: ${props => props.$rect.width * 100}%;
  height: ${props => props.$rect.height * 100}%;
`;

/**
 * No border-radius here — an interior tile corner would round the seam
 * between it and its neighbour. Only the outer edge of the whole grid
 * (`CollageGrid`'s `GridFrame`) is ever rounded.
 */
const TileInner = styled.div<{ $isDropTarget: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  outline: 2px solid
    ${props => (props.$isDropTarget ? props.theme.color.accent : 'transparent')};
  outline-offset: -2px;
  transition: outline-color ${props => props.theme.duration.fast} ease;
`;

const LoadingTile = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => props.theme.color.surfaceSunken};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.color.textMuted};
  font-size: ${props => props.theme.fontSize.xs};
  text-align: center;
  padding: ${props => props.theme.space.xs};
`;

/**
 * Sits above `CropCanvas` in DOM order (so it paints on top with no
 * z-index needed) but is not nested inside its pannable `Frame` — a
 * pointerdown here must never bubble into `Frame`'s own raw pointer
 * handlers, or dragging a button here would also start a pan.
 */
const TopBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.xxs};
  padding: ${props => props.theme.space.xxs};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border: none;
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => props.theme.color.scrimOnImage};
  color: ${props => props.theme.color.accentContrast};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.sm};
  line-height: 1;

  &:hover:not(:disabled) {
    background: ${props => props.theme.color.scrimOnImageHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DragHandle = styled(IconButton)`
  cursor: grab;
  margin-right: auto;
  /* dnd-kit needs this so a touch drag doesn't also scroll the page. */
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

export type CollageTileProps = {
  readonly id: string;
  readonly name: string;
  readonly previewUrl: string;
  readonly naturalSize: Size | undefined;
  readonly cropView: CropView | undefined;
  readonly ratio: Ratio;
  readonly rect: Rect;
  readonly onCropViewChange: (view: CropView) => void;
  readonly onFocus: () => void;
  readonly onRemove: () => void;
  readonly isExporting: boolean;
  /** True while any tile in the grid is being dragged, this one included. */
  readonly isDragActive: boolean;
};

export const CollageTile = ({
  id,
  name,
  previewUrl,
  naturalSize,
  cropView,
  ratio,
  rect,
  onCropViewChange,
  onFocus,
  onRemove,
  isExporting,
  isDragActive,
}: CollageTileProps) => {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({ id });

  return (
    <TileBox $rect={rect} ref={setDropRef}>
      <TileInner $isDropTarget={isOver}>
        {naturalSize && cropView ? (
          <CropCanvas
            imageName={name}
            imageSrc={previewUrl}
            naturalSize={naturalSize}
            ratio={ratio}
            view={cropView}
            onViewChange={onCropViewChange}
          />
        ) : (
          <LoadingTile>Foto wordt geladen…</LoadingTile>
        )}

        <TopBar>
          <DragHandle
            ref={setDragRef}
            type="button"
            aria-label={`Versleep ${name} om van plek te wisselen`}
            style={{ transform: CSS.Translate.toString(transform) }}
            {...attributes}
            {...listeners}
          >
            ⠿
          </DragHandle>
          <IconButton
            type="button"
            onClick={onFocus}
            disabled={isDragActive || isExporting}
            aria-label={`Bewerk ${name} groter`}
          >
            <Maximize2 size={16} />
          </IconButton>
          <IconButton
            type="button"
            onClick={onRemove}
            disabled={isDragActive || isExporting}
            aria-label={`Verwijder ${name}`}
          >
            ✕
          </IconButton>
        </TopBar>
      </TileInner>
    </TileBox>
  );
};
