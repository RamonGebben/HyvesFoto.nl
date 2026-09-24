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
  /* Range inputs have a browser-default intrinsic width (~129px) that a
     flex item won't shrink below unless min-width is reset — without this
     the track overflows its card on narrow phones (iPhone SE and similar). */
  min-width: 0;
  accent-color: ${props => props.theme.color.action};
`;

export type MobileGuideOpacitySliderProps = {
  /** 0 (hidden) to 1 (fully visible). */
  opacity: number;
  onChange: (opacity: number) => void;
  label?: string;
};

const STEP_COUNT = 100;

/** Adjusts how visible the mobile safe-zone shutters/ticks are on the canvas. */
export const MobileGuideOpacitySlider = ({
  opacity,
  onChange,
  label = 'Mobiele afsnijding tonen',
}: MobileGuideOpacitySliderProps) => {
  const inputId = useId();

  return (
    <Wrapper>
      <Label htmlFor={inputId}>{label}</Label>
      <Slider
        id={inputId}
        type="range"
        min={0}
        max={1}
        step={1 / STEP_COUNT}
        value={opacity}
        onChange={event => onChange(Number(event.target.value))}
      />
    </Wrapper>
  );
};
