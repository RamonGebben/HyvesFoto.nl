import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MobileSafeZoneOverlay } from './index';

// Mirrors how a real caller sizes `CollageGrid`'s `GridFrameWrapper`: full
// width, aspect-ratio driven by the desktop ratio, with a visible image
// underneath so the shutters read as cropping something.
const SizedContainer = ({
  ratio,
  children,
}: {
  ratio: number;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      aspectRatio: ratio,
      borderRadius: 20,
      overflow: 'hidden',
      background:
        'repeating-linear-gradient(45deg, #f7941e, #f7941e 20px, #1c3f63 20px, #1c3f63 40px)',
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Molecules/MobileSafeZoneOverlay',
  component: MobileSafeZoneOverlay,
  args: {
    desktopRatio: { width: 52, height: 25 },
    mobileRatio: { width: 311, height: 200 },
    opacity: 1,
  },
  argTypes: {
    desktopRatio: { control: 'object' },
    mobileRatio: { control: 'object' },
  },
  decorators: [
    (Story, { args }) => (
      <SizedContainer
        ratio={args.desktopRatio.width / args.desktopRatio.height}
      >
        <Story />
      </SizedContainer>
    ),
  ],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MobileSafeZoneOverlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Buzz: Story = {};

export const NoCutoff: Story = {
  args: {
    mobileRatio: { width: 52, height: 25 },
  },
};

export const HalfVisible: Story = {
  args: {
    opacity: 0.5,
  },
};
