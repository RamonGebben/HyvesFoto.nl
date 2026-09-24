import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { collageLayoutOptions } from '~/content/collageLayouts';
import { defaultCropView } from '~/utils/computeCropRect';
import { resolveCollageTiles } from '~/utils/resolveCollageTiles';

import { CollageGrid } from './index';
import type { CollageGridImage } from './index';

const buzz = { width: 52, height: 25 };

const swatch = (
  fill: string,
  label: string,
  naturalSize: { width: number; height: number },
) =>
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${naturalSize.width}" height="${naturalSize.height}">
      <rect width="${naturalSize.width}" height="${naturalSize.height}" fill="${fill}"/>
      <text x="50%" y="50%" font-size="${Math.min(naturalSize.width, naturalSize.height) / 4}"
        fill="white" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif">${label}</text>
    </svg>`,
  );

const naturalSize = { width: 1200, height: 900 };
const colors = [
  '#f7941e',
  '#1f6fd0',
  '#2e7d32',
  '#c62828',
  '#7a5cf0',
  '#e5850f',
];

const makeImages = (count: number): readonly CollageGridImage[] =>
  Array.from({ length: count }, (_unused, index) => ({
    id: `image-${index}`,
    name: `foto-${index + 1}.svg`,
    previewUrl: swatch(
      colors[index % colors.length]!,
      `${index + 1}`,
      naturalSize,
    ),
    naturalSize,
    cropView: defaultCropView(naturalSize),
  }));

const findLayout = (id: string) => {
  const option = collageLayoutOptions.find(candidate => candidate.id === id);
  if (!option) throw new Error(`Unknown layout id: ${id}`);
  return option;
};

const meta = {
  title: 'Organisms/CollageGrid',
  component: CollageGrid,
  args: {
    outputRatio: buzz,
    mobileGuideOpacity: 1,
    onCropViewChange: fn(),
    onRemoveImage: fn(),
    onSwapImages: fn(),
    isExporting: false,
  },
  argTypes: {
    images: { control: false },
    tiles: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CollageGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleImage: Story = {
  args: {
    images: makeImages(1),
    tiles: resolveCollageTiles(findLayout('1-full').tree, buzz, 0.012),
  },
};

export const TwoColumns: Story = {
  args: {
    images: makeImages(2),
    tiles: resolveCollageTiles(findLayout('2-columns').tree, buzz, 0.012),
  },
};

export const ThreeBigLeft: Story = {
  args: {
    images: makeImages(3),
    tiles: resolveCollageTiles(findLayout('3-big-left').tree, buzz, 0.012),
  },
};

export const FourGrid: Story = {
  args: {
    images: makeImages(4),
    tiles: resolveCollageTiles(findLayout('4-grid').tree, buzz, 0.012),
  },
};

export const NoGap: Story = {
  args: {
    images: makeImages(3),
    tiles: resolveCollageTiles(findLayout('3-columns').tree, buzz, 0),
  },
};

export const WideGap: Story = {
  args: {
    images: makeImages(4),
    tiles: resolveCollageTiles(findLayout('4-grid').tree, buzz, 0.04),
  },
};
