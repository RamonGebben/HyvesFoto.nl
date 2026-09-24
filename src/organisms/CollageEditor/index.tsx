'use client';

import { EditorTemplate } from '~/templates/EditorTemplate';

import { useCollageEditor } from './hooks/useCollageEditor';

/**
 * Bridges the editor store and IndexedDB to the presentational template.
 * The page renders this; the template stays props-in / JSX-out.
 */
export const CollageEditor = () => <EditorTemplate {...useCollageEditor()} />;
