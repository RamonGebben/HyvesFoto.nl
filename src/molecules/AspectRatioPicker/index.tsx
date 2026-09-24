'use client';

import styled from 'styled-components';

import type { AspectRatioId, AspectRatioPreset } from '~/content/aspectRatios';
import { formatAspectRatio } from '~/utils/formatAspectRatio';

const Fieldset = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.space.xs};
  border: 0;
  padding: 0;
  margin: 0;
  display: none;
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
  gap: 2px;
  padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
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

const OptionLabel = styled.span`
  font-weight: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.sm};
`;

const OptionRatio = styled.span`
  color: ${props => props.theme.color.textMuted};
  font-size: ${props => props.theme.fontSize.xs};
`;

/* Invisible, but covers the whole option so it is the actual click target.
   The visual state lives on the label; focus is drawn via :has(:focus-visible). */
const HiddenRadio = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

export type AspectRatioPickerProps = {
  presets: readonly AspectRatioPreset[];
  selectedId: AspectRatioId;
  onSelect: (id: AspectRatioId) => void;
  legend?: string;
};

export const AspectRatioPicker = ({
  presets,
  selectedId,
  onSelect,
  legend = 'Doelformaat',
}: AspectRatioPickerProps) => (
  <Fieldset>
    <Legend>{legend}</Legend>
    {presets.map(preset => (
      <Option
        key={preset.id}
        $isSelected={preset.id === selectedId}
        title={preset.description}
      >
        <HiddenRadio
          type="radio"
          name="aspect-ratio"
          value={preset.id}
          checked={preset.id === selectedId}
          onChange={() => onSelect(preset.id)}
        />
        <OptionLabel>{preset.label}</OptionLabel>
        <OptionRatio>{formatAspectRatio(preset)}</OptionRatio>
      </Option>
    ))}
  </Fieldset>
);
