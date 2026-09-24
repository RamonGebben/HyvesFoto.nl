import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { getLayoutOptionsForCount } from '~/utils/collageLayoutOptions';

import { CollageLayoutPicker } from './index';

const buzz = { width: 15, height: 6 };

const meta = {
  title: 'Molecules/CollageLayoutPicker',
  component: CollageLayoutPicker,
  args: {
    options: getLayoutOptionsForCount(3),
    selectedId: getLayoutOptionsForCount(3)[0]?.id,
    outputRatio: buzz,
    onSelect: fn(),
  },
  argTypes: {
    options: { control: false },
    outputRatio: { control: 'object' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CollageLayoutPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThreeImages: Story = {};

export const SixImages: Story = {
  args: {
    options: getLayoutOptionsForCount(6),
    selectedId: getLayoutOptionsForCount(6)[0]?.id,
  },
};

export const GeneratedFallback: Story = {
  args: {
    options: getLayoutOptionsForCount(8),
    selectedId: getLayoutOptionsForCount(8)[0]?.id,
  },
};

/** Drives selection through local state so the control is actually usable. */
export const Interactive: Story = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedId, setSelectedId] = useState(args.selectedId);
    return (
      <CollageLayoutPicker
        {...args}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    );
  },
};
