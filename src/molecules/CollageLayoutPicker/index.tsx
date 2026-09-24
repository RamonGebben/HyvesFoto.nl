'use client';

import styled from 'styled-components';

import type { CollageLayoutOption } from '~/content/collageLayouts';
import { flattenLayoutTree } from '~/utils/flattenLayoutTree';
import type { Ratio, Rect } from '~/utils/geometry';

const Fieldset = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.space.xs};
  border: 0;
  padding: 0;
  margin: 0;
`;

const Legend = styled.legend`
  padding: 0;
  margin-bottom: ${props => props.theme.space.xs};
  color: ${props => props.theme.color.textMuted};
  font-size: ${props => props.theme.fontSize.sm};
`;

const Option = styled.label<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.space.xxs};
  width: 5.5rem;
  padding: ${props => props.theme.space.xs};
  border: 1px solid
    ${props =>
      props.$isSelected ? props.theme.color.accent : props.theme.color.border};
  border-radius: ${props => props.theme.radius.md};
  background: ${props =>
    props.$isSelected
      ? props.theme.color.surfaceSunken
      : props.theme.color.surface};
  cursor: pointer;
  transition:
    border-color ${props => props.theme.duration.fast} ease,
    background ${props => props.theme.duration.fast} ease;

  &:has(:focus-visible) {
    box-shadow: ${props => props.theme.shadow.focusRing};
  }
`;

const Thumbnail = styled.div<{ $ratio: number }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${props => props.$ratio};
  border-radius: ${props => props.theme.radius.sm};
  overflow: hidden;
  background: ${props => props.theme.color.canvas};
`;

const ThumbnailTile = styled.div<{ $rect: Rect }>`
  position: absolute;
  left: ${props => props.$rect.x * 100}%;
  top: ${props => props.$rect.y * 100}%;
  width: ${props => props.$rect.width * 100}%;
  height: ${props => props.$rect.height * 100}%;
  background: ${props => props.theme.color.border};
  border-radius: 2px;
`;

const OptionLabel = styled.span`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.color.textMuted};
  text-align: center;
`;

/* Invisible, but covers the whole option so it is the actual click target —
   same pattern as AspectRatioPicker. */
const HiddenRadio = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  /* The thumbnail below is also positioned (for its own tile overlay), so
     without an explicit z-index it would paint on top and swallow clicks
     meant for this input — unlike AspectRatioPicker, whose sibling content
     is plain unpositioned text. */
  z-index: 1;
`;

export type CollageLayoutPickerProps = {
  options: readonly CollageLayoutOption[];
  selectedId: string | undefined;
  outputRatio: Ratio;
  onSelect: (id: string) => void;
  legend?: string;
};

/** A visible gap in the thumbnail so tile boundaries read clearly at a small size. */
const THUMBNAIL_GAP_RATIO = 0.03;

export const CollageLayoutPicker = ({
  options,
  selectedId,
  outputRatio,
  onSelect,
  legend = 'Indeling',
}: CollageLayoutPickerProps) => (
  <Fieldset>
    <Legend>{legend}</Legend>
    {options.map(option => (
      <Option key={option.id} $isSelected={option.id === selectedId}>
        <HiddenRadio
          type="radio"
          name="collage-layout"
          value={option.id}
          checked={option.id === selectedId}
          onChange={() => onSelect(option.id)}
        />
        <Thumbnail $ratio={outputRatio.width / outputRatio.height}>
          {flattenLayoutTree(option.tree, outputRatio, THUMBNAIL_GAP_RATIO).map(
            (rect, index) => (
              // Tiles have no stable id of their own — index is fine, the
              // list itself never reorders.
              <ThumbnailTile key={index} $rect={rect} />
            ),
          )}
        </Thumbnail>
        <OptionLabel>{option.label}</OptionLabel>
      </Option>
    ))}
  </Fieldset>
);
