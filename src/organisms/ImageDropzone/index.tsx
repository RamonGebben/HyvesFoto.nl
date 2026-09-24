'use client';

import { ImageDropzoneView } from './components/ImageDropzoneView';
import { useImageDropzone } from './hooks/useImageDropzone';

export type ImageDropzoneProps = {
  onFilesAccepted: (files: readonly File[]) => void;
};

/**
 * Connected organism: owns the drag/drop wiring, renders the presentational
 * view. All decision logic lives in `partitionImageFiles`.
 */
export const ImageDropzone = ({ onFilesAccepted }: ImageDropzoneProps) => {
  const { isDraggingOver, rejectedFileNames, rootProps, inputProps } =
    useImageDropzone({ onFilesAccepted });

  return (
    <ImageDropzoneView
      isDraggingOver={isDraggingOver}
      rejectedFileNames={rejectedFileNames}
      rootProps={rootProps}
      inputProps={inputProps}
    />
  );
};
