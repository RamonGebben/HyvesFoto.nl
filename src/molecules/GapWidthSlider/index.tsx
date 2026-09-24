'use client';

import { useId } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.color.textMuted};
  white-space: nowrap;
`;

const Slider = styled.input`
  flex: 1;
  accent-color: ${props => props.theme.color.action};
`;

export type GapWidthSliderProps = {
  gapRatio: number;
  min: number;
  max: number;
  onChange: (gapRatio: number) => void;
  label?: string;
};

const STEP_COUNT = 100;

/** A slider for the gap between collage tiles, down to exactly 0. */
export const GapWidthSlider = ({
  gapRatio,
  min,
  max,
  onChange,
  label = 'Randbreedte',
}: GapWidthSliderProps) => {
  const inputId = useId();

  return (
    <Wrapper>
      <Label htmlFor={inputId}>{label}</Label>
      <Slider
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={(max - min) / STEP_COUNT}
        value={gapRatio}
        onChange={event => onChange(Number(event.target.value))}
      />
    </Wrapper>
  );
};
