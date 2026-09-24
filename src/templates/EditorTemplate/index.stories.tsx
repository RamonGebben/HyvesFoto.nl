import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import {
  aspectRatioPresets,
  defaultAspectRatioId,
} from '~/content/aspectRatios';
import { getLayoutOptionsForCount } from '~/utils/collageLayoutOptions';
import { defaultCropView } from '~/utils/computeCropRect';
import { resolveCollageTiles } from '~/utils/resolveCollageTiles';

import type { EditorTemplateImage } from './index';
import { EditorTemplate } from './index';

// A small solid-colour SVG so stories never depend on a network request.
const placeholderImage = (fill: string, label: string) =>
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="800" height="600" fill="${fill}"/>
      <text x="400" y="310" font-size="60" fill="#ffffff" text-anchor="middle"
        font-family="sans-serif">${label}</text>
    </svg>`,
  );

const naturalSize = { width: 800, height: 600 };
const buzzRatio = aspectRatioPresets[0]!;
const GAP_RATIO = 0.012;

const makeImage = (
  id: string,
  name: string,
  fill: string,
): EditorTemplateImage => ({
  id,
  name,
  previewUrl: placeholderImage(fill, name),
  naturalSize,
  cropView: defaultCropView(naturalSize),
});

const withLayout = (images: readonly EditorTemplateImage[]) => {
  const layoutOptions = getLayoutOptionsForCount(images.length);
  const selectedLayoutId = layoutOptions[0]!.id;
  return {
    images,
    tiles: resolveCollageTiles(layoutOptions[0]!.tree, buzzRatio, GAP_RATIO),
    layoutOptions,
    selectedLayoutId,
  };
};

const meta = {
  title: 'Templates/EditorTemplate',
  component: EditorTemplate,
  args: {
    presets: aspectRatioPresets,
    selectedAspectRatioId: defaultAspectRatioId,
    outputRatio: buzzRatio,
    images: [],
    tiles: [],
    layoutOptions: [],
    selectedLayoutId: undefined,
    gapRatio: GAP_RATIO,
    minGapRatio: 0,
    maxGapRatio: 0.04,
    onSelectAspectRatio: fn(),
    onSelectLayout: fn(),
    onGapRatioChange: fn(),
    onFilesAccepted: fn(),
    onRemoveImage: fn(),
    onCropViewChange: fn(),
    onSwapImages: fn(),
    onExportCollage: fn(),
    onReset: fn(),
    isExporting: false,
  },
  argTypes: {
    presets: { control: false },
    images: { control: false },
    tiles: { control: false },
    layoutOptions: { control: false },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof EditorTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithOnePhoto: Story = {
  args: withLayout([makeImage('1', 'profielfoto.png', '#1f6fd0')]),
};

/** The magazine-style grid this app exists for. */
export const WithThreePhotoGrid: Story = {
  args: withLayout([
    makeImage('1', 'strand.jpg', '#1f6fd0'),
    makeImage('2', 'terras.jpg', '#f7941e'),
    makeImage('3', 'festival.jpg', '#2e7d32'),
  ]),
};

export const WithSixPhotoGrid: Story = {
  args: withLayout([
    makeImage('1', 'strand.jpg', '#1f6fd0'),
    makeImage('2', 'terras.jpg', '#f7941e'),
    makeImage('3', 'festival.jpg', '#2e7d32'),
    makeImage('4', 'concert.jpg', '#c62828'),
    makeImage('5', 'park.jpg', '#7a5cf0'),
    makeImage('6', 'diner.jpg', '#e5850f'),
  ]),
};

/** Still deciding on dimensions — a decode is pending. */
export const WithLoadingImage: Story = {
  args: withLayout([
    {
      id: '1',
      name: 'nieuw.jpg',
      previewUrl: placeholderImage('#7a8794', 'nieuw.jpg'),
    },
  ]),
};

export const Exporting: Story = {
  args: {
    ...withLayout([makeImage('1', 'strand.jpg', '#1f6fd0')]),
    isExporting: true,
  },
};
