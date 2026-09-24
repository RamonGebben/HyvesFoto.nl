import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '~/testing/renderWithProviders';

import { Button } from './index';

describe('Button', () => {
  it('renders as a non-submitting button by default', () => {
    renderWithProviders(<Button>Collage exporteren</Button>);

    expect(
      screen.getByRole('button', { name: 'Collage exporteren' }),
    ).toHaveAttribute('type', 'button');
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Bijsnijden</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Bijsnijden' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick while disabled', async () => {
    const onClick = vi.fn();
    renderWithProviders(
      <Button disabled onClick={onClick}>
        Bijsnijden
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Bijsnijden' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps transient styling props out of the DOM', () => {
    renderWithProviders(
      <Button variant="secondary" size="sm" isFullWidth>
        Bijsnijden
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Bijsnijden' });
    expect(button).not.toHaveAttribute('isFullWidth');
    expect(button).not.toHaveAttribute('$isFullWidth');
    expect(button).not.toHaveAttribute('variant');
  });
});
