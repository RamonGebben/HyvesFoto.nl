import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { MobileGuideOpacitySlider } from './index';

const meta = {
  title: 'Molecules/MobileGuideOpacitySlider',
  component: MobileGuideOpacitySlider,
  args: {
    opacity: 1,
    onChange: fn(),
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MobileGuideOpacitySlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hidden: Story = {
  args: { opacity: 0 },
};

export const HalfVisible: Story = {
  args: { opacity: 0.5 },
};

/** Drives the value through local state so the slider is actually usable. */
export const Interactive: Story = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opacity, setOpacity] = useState(args.opacity);
    return (
      <MobileGuideOpacitySlider
        {...args}
        opacity={opacity}
        onChange={setOpacity}
      />
    );
  },
};
