'use client';

import { useId } from 'react';
import styled from 'styled-components';

const Root = styled.div<{ $isDraggingOver: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  padding: ${props => props.theme.space.xxl} ${props => props.theme.space.lg};
  text-align: center;
  border: 2px dashed
    ${props =>
      props.$isDraggingOver
        ? props.theme.color.accent
        : props.theme.color.borderStrong};
  border-radius: ${props => props.theme.radius.lg};
  background: ${props =>
    props.$isDraggingOver
      ? props.theme.color.surfaceSunken
      : props.theme.color.bg};
  transition:
    border-color ${props => props.theme.duration.fast} ease,
    background ${props => props.theme.duration.fast} ease;
`;

const Title = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const Hint = styled.p`
  color: ${props => props.theme.color.textMuted};
  font-size: ${props => props.theme.fontSize.sm};
  max-width: 42ch;
`;

const BrowseLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.lg};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.color.action};
  color: ${props => props.theme.color.actionContrast};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.color.actionHover};
  }

  &:focus-within {
    box-shadow: ${props => props.theme.shadow.focusRing};
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

const RejectedMessage = styled.p`
  color: ${props => props.theme.color.danger};
  font-size: ${props => props.theme.fontSize.sm};
`;

export type ImageDropzoneViewProps = {
  isDraggingOver: boolean;
  rejectedFileNames: readonly string[];
  rootProps: React.ComponentPropsWithoutRef<'div'>;
  inputProps: React.ComponentPropsWithoutRef<'input'>;
};

export const ImageDropzoneView = ({
  isDraggingOver,
  rejectedFileNames,
  rootProps,
  inputProps,
}: ImageDropzoneViewProps) => {
  const inputId = useId();

  return (
    <Root $isDraggingOver={isDraggingOver} {...rootProps}>
      <Title>Sleep je foto’s hierheen</Title>
      <Hint>
        JPEG, PNG, WebP, GIF of AVIF. Voeg er drie toe voor een tijdlijncollage,
        of één om los bij te snijden.
      </Hint>

      <BrowseLabel htmlFor={inputId}>
        Kies foto’s
        <HiddenInput id={inputId} {...inputProps} />
      </BrowseLabel>

      {rejectedFileNames.length > 0 && (
        <RejectedMessage role="alert">
          {`Kon ${rejectedFileNames.join(', ')} niet lezen — dat bestandsformaat wordt niet ondersteund.`}
        </RejectedMessage>
      )}
    </Root>
  );
};
