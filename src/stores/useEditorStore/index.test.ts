import { afterEach, describe, expect, it } from 'vitest';

import { useEditorStore } from './index';

const image = (id: string) => ({ id, name: id, previewUrl: `blob:${id}` });

afterEach(() => {
  useEditorStore.setState({ images: [], cropViews: {} });
});

describe('useEditorStore.moveImage', () => {
  it('swaps two images by id, regardless of their positions', () => {
    useEditorStore.setState({
      images: [image('a'), image('b'), image('c')],
    });

    useEditorStore.getState().moveImage('a', 'c');

    expect(useEditorStore.getState().images.map(i => i.id)).toEqual([
      'c',
      'b',
      'a',
    ]);
  });

  it('does nothing when swapping an image with itself', () => {
    useEditorStore.setState({ images: [image('a'), image('b')] });

    useEditorStore.getState().moveImage('a', 'a');

    expect(useEditorStore.getState().images.map(i => i.id)).toEqual(['a', 'b']);
  });

  it('does nothing when either id is unknown', () => {
    useEditorStore.setState({ images: [image('a'), image('b')] });

    useEditorStore.getState().moveImage('a', 'missing');

    expect(useEditorStore.getState().images.map(i => i.id)).toEqual(['a', 'b']);
  });
});
