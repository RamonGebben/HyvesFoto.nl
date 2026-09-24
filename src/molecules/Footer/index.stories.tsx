import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Footer } from './index';

const meta = {
  title: 'Molecules/Footer',
  component: Footer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
