import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { GapWidthSlider } from './index';

const meta = {
  title: 'Molecules/GapWidthSlider',
  component: GapWidthSlider,
  args: {
    gapRatio: 0.012,
    min: 0,
    max: 0.04,
    onChange: fn(),
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof GapWidthSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoGap: Story = {
  args: { gapRatio: 0 },
};

export const MaxGap: Story = {
  args: { gapRatio: 0.04 },
};

/** Drives the value through local state so the slider is actually usable. */
export const Interactive: Story = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [gapRatio, setGapRatio] = useState(args.gapRatio);
    return (
      <GapWidthSlider {...args} gapRatio={gapRatio} onChange={setGapRatio} />
    );
  },
};
