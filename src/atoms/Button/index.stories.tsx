import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CirclePlus, Pencil, Settings, Share2, Users } from 'lucide-react';

import { Button } from './index';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    children: 'Collage exporteren',
    variant: 'primary',
    size: 'md',
    isFullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'accent', 'dark', 'grey', 'ghost'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    isFullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    icon: <Share2 />,
    children: 'Voorkeuren',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    icon: <Pencil />,
    children: 'Schrijven',
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    icon: <Settings />,
    children: 'Instellingen',
  },
};

export const Grey: Story = {
  args: { variant: 'grey', children: 'Begin opnieuw' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Opnieuw beginnen' },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <Users />,
    children: 'Leden',
  },
};

export const IconAndPrimary: Story = {
  args: {
    variant: 'primary',
    icon: <CirclePlus />,
    children: 'Bericht',
  },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Bijsnijden' },
};

export const FullWidth: Story = {
  args: { isFullWidth: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
