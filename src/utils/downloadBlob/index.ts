/**
 * Saves a Blob to disk through the browser's normal download flow.
 *
 * Browser-only IO — there is nothing here for the `unit` project to exercise
 * without a real DOM and a user gesture; covered by e2e instead. The anchor
 * is attached to the document before clicking: some browsers only honour
 * `download` on an anchor that is actually in the DOM.
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
