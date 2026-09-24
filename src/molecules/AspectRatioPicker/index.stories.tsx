import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import {
  aspectRatioPresets,
  defaultAspectRatioId,
} from '~/content/aspectRatios';
import type { AspectRatioId } from '~/content/aspectRatios';

import { AspectRatioPicker } from './index';

const meta = {
  title: 'Molecules/AspectRatioPicker',
  component: AspectRatioPicker,
  args: {
    presets: aspectRatioPresets,
    selectedId: defaultAspectRatioId,
    legend: 'Doelformaat',
    onSelect: fn(),
  },
  argTypes: {
    selectedId: {
      control: 'inline-radio',
      options: aspectRatioPresets.map(preset => preset.id),
    },
    legend: { control: 'text' },
    presets: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AspectRatioPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Drives selection through local state so the control is actually usable. */
export const Interactive: Story = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedId, setSelectedId] = useState<AspectRatioId>(
      args.selectedId,
    );

    return (
      <AspectRatioPicker
        {...args}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    );
  },
};
