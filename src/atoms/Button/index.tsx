'use client';

import styled, { css } from 'styled-components';

export type ButtonVariant =
  'primary' | 'secondary' | 'accent' | 'dark' | 'grey' | 'ghost';
export type ButtonSize = 'sm' | 'md';

type StyledButtonProps = {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $isFullWidth: boolean;
};

const variantStyles = {
  // Hyves puts its call-to-action in blue, not in the brand orange.
  primary: css`
    background: ${props => props.theme.color.action};
    color: ${props => props.theme.color.actionContrast};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${props => props.theme.color.actionHover};
    }
  `,
  secondary: css`
    background: ${props => props.theme.color.surfaceSunken};
    color: ${props => props.theme.color.text};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${props => props.theme.color.border};
    }
  `,
  // Hyves orange, for standalone compose actions ("Schrijven").
  accent: css`
    background: ${props => props.theme.color.accent};
    color: ${props => props.theme.color.accentContrast};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${props => props.theme.color.accentHover};
    }
  `,
  // Hyves dark navy, for settings-style actions ("Instellingen").
  dark: css`
    background: ${props => props.theme.color.dark};
    color: ${props => props.theme.color.darkContrast};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${props => props.theme.color.darkHover};
    }
  `,
  grey: css`
    background: ${props => props.theme.color.neutral};
    color: ${props => props.theme.color.text};
    border-color: ${props => props.theme.color.neutralBorder};

    &:hover:not(:disabled) {
      background: ${props => props.theme.color.neutralHover};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${props => props.theme.color.textMuted};
    border-color: transparent;

    &:hover:not(:disabled) {
      color: ${props => props.theme.color.text};
      background: ${props => props.theme.color.surfaceSunken};
    }
  `,
} as const satisfies Record<ButtonVariant, ReturnType<typeof css>>;

const sizeStyles = {
  sm: css`
    padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
    font-size: ${props => props.theme.fontSize.sm};
  `,
  md: css`
    padding: ${props => props.theme.space.sm} ${props => props.theme.space.lg};
    font-size: ${props => props.theme.fontSize.md};
  `,
} as const satisfies Record<ButtonSize, ReturnType<typeof css>>;

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.xs};
  border: 1px solid;
  border-radius: ${props => props.theme.radius.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  line-height: 1.2;
  cursor: pointer;
  transition:
    background ${props => props.theme.duration.fast} ease,
    border-color ${props => props.theme.duration.fast} ease,
    color ${props => props.theme.duration.fast} ease;

  ${props => variantStyles[props.$variant]}
  ${props => sizeStyles[props.$size]}
  width: ${props => (props.$isFullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.15em;
    height: 1.15em;
    flex-shrink: 0;
  }
`;

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  /** Leading icon, e.g. a `lucide-react` component sized to `1.15em`. */
  icon?: React.ReactNode;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  type = 'button',
  icon,
  children,
  ...buttonProps
}: ButtonProps) => (
  <StyledButton
    $variant={variant}
    $size={size}
    $isFullWidth={isFullWidth}
    type={type}
    {...buttonProps}
  >
    {icon}
    {children}
  </StyledButton>
);
