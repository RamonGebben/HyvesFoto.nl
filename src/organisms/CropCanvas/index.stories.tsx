import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { defaultCropView } from '~/utils/computeCropRect';
import type { CropView } from '~/utils/computeCropRect';

import { CropCanvas } from './index';

// A small solid-colour PNG so drag/zoom is visibly meaningful without a
// network request. Generated at 320x180 (16:9), orange fill.
const sampleImageSrc =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
      <rect width="1600" height="900" fill="#f7941e"/>
      <circle cx="480" cy="300" r="220" fill="#1c3f63"/>
      <circle cx="1150" cy="620" r="260" fill="#ffffff"/>
      <text x="800" y="470" font-size="140" fill="#1c3f63" text-anchor="middle"
        font-family="sans-serif">Buzz</text>
    </svg>`,
  );

const naturalSize = { width: 1600, height: 900 };

// `CropCanvas` fills whatever box it's given — a real caller wraps it in an
// aspect-ratio'd container (a standalone crop) or a percentage-positioned
// grid tile (one tile of a collage). Stories need that same container.
const SizedContainer = ({
  ratio,
  children,
}: {
  ratio: number;
  children: React.ReactNode;
}) => (
  <div style={{ width: '100%', maxWidth: 480, aspectRatio: ratio }}>
    {children}
  </div>
);

const meta = {
  title: 'Organisms/CropCanvas',
  component: CropCanvas,
  args: {
    imageName: 'voorbeeld.svg',
    imageSrc: sampleImageSrc,
    naturalSize,
    ratio: { width: 15, height: 6 },
    view: defaultCropView(naturalSize),
    onViewChange: fn(),
  },
  argTypes: {
    naturalSize: { control: false },
    ratio: { control: 'object' },
    view: { control: 'object' },
    onViewChange: { action: 'view changed' },
  },
  decorators: [
    (Story, { args }) => (
      <SizedContainer ratio={args.ratio.width / args.ratio.height}>
        <Story />
      </SizedContainer>
    ),
  ],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CropCanvas>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BuzzRatio: Story = {};

export const CollageSlotRatio: Story = {
  args: {
    // The narrow 5:6 sliver each photo gets in a three-photo collage.
    ratio: { width: 5, height: 6 },
  },
};

export const ZoomedIn: Story = {
  args: {
    view: { zoom: 2.5, center: defaultCropView(naturalSize).center },
  },
};

/** Drives pan and zoom through local state so the control is actually usable. */
export const Interactive: Story = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [view, setView] = useState<CropView>(args.view);
    return <CropCanvas {...args} view={view} onViewChange={setView} />;
  },
};
