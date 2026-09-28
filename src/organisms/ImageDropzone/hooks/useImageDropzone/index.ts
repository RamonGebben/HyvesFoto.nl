'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * Image formats a browser canvas can reliably decode and re-encode. Anything
 * else (HEIC straight off an iPhone, TIFF, PDF) is rejected loudly rather than
 * failing later on the canvas with an empty frame.
 */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const;

export type FilePartition = {
  readonly accepted: readonly File[];
  readonly rejected: readonly File[];
};

const isAcceptedImage = (file: File): boolean =>
  (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);

/**
 * Splits dropped files into the ones the editor can open and the ones it
 * cannot. Pure and exported so the browser-free `unit` project can test the
 * decision without a renderer or a DataTransfer.
 */
export const partitionImageFiles = (files: readonly File[]): FilePartition =>
  files.reduce<FilePartition>(
    (partition, file) =>
      isAcceptedImage(file)
        ? { ...partition, accepted: [...partition.accepted, file] }
        : { ...partition, rejected: [...partition.rejected, file] },
    { accepted: [], rejected: [] },
  );

type UseImageDropzoneOptions = {
  onFilesAccepted: (files: readonly File[]) => void;
};

export const useImageDropzone = ({
  onFilesAccepted,
}: UseImageDropzoneOptions) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [rejectedFileNames, setRejectedFileNames] = useState<readonly string[]>(
    [],
  );

  const handleFiles = useCallback(
    (files: readonly File[]) => {
      const { accepted, rejected } = partitionImageFiles(files);

      setRejectedFileNames(rejected.map(file => file.name));

      if (accepted.length > 0) {
        onFilesAccepted(accepted);
      }
    },
    [onFilesAccepted],
  );

  const rootProps = useMemo(
    () => ({
      onDragOver: (event: React.DragEvent<HTMLElement>) => {
        // Without this the browser navigates to the dropped file.
        event.preventDefault();
        setIsDraggingOver(true);
      },
      onDragLeave: () => setIsDraggingOver(false),
      onDrop: (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
        handleFiles([...event.dataTransfer.files]);
      },
    }),
    [handleFiles],
  );

  const inputProps = useMemo(
    () => ({
      type: 'file' as const,
      // A wildcard, not the explicit ACCEPTED_IMAGE_TYPES list: Android's
      // "From this device" file picker fails to list folders when `accept`
      // contains multiple comma-separated MIME types. Real validation still
      // happens in partitionImageFiles, so the OS-picker hint can stay loose.
      accept: 'image/*',
      multiple: true,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles([...(event.target.files ?? [])]);
        // Allows re-selecting the same file after removing it.
        event.target.value = '';
      },
    }),
    [handleFiles],
  );

  return { isDraggingOver, rejectedFileNames, rootProps, inputProps };
};
