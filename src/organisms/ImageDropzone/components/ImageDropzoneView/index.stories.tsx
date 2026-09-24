import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ImageDropzoneView } from './index';

const meta = {
  title: 'Organisms/ImageDropzone/ImageDropzoneView',
  component: ImageDropzoneView,
  args: {
    isDraggingOver: false,
    rejectedFileNames: [],
    rootProps: {},
    inputProps: { type: 'file', accept: 'image/*', multiple: true },
  },
  argTypes: {
    isDraggingOver: { control: 'boolean' },
    rejectedFileNames: { control: 'object' },
    rootProps: { control: false },
    inputProps: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ImageDropzoneView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const DraggingOver: Story = {
  args: { isDraggingOver: true },
};

export const WithRejectedFiles: Story = {
  args: { rejectedFileNames: ['holiday.heic', 'scan.tiff'] },
};
