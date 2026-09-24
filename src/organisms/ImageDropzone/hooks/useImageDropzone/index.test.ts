import { describe, expect, it } from 'vitest';

import { ACCEPTED_IMAGE_TYPES, partitionImageFiles } from './index';

const makeFile = (name: string, type: string) =>
  new File(['bytes'], name, { type });

describe('partitionImageFiles', () => {
  it('accepts every supported image type', () => {
    const files = ACCEPTED_IMAGE_TYPES.map((type, index) =>
      makeFile(`photo-${index}`, type),
    );

    const { accepted, rejected } = partitionImageFiles(files);

    expect(accepted).toHaveLength(ACCEPTED_IMAGE_TYPES.length);
    expect(rejected).toEqual([]);
  });

  it('rejects formats a canvas cannot decode', () => {
    const { accepted, rejected } = partitionImageFiles([
      makeFile('holiday.heic', 'image/heic'),
      makeFile('scan.tiff', 'image/tiff'),
      makeFile('report.pdf', 'application/pdf'),
    ]);

    expect(accepted).toEqual([]);
    expect(rejected.map(file => file.name)).toEqual([
      'holiday.heic',
      'scan.tiff',
      'report.pdf',
    ]);
  });

  it('splits a mixed drop and preserves order within each group', () => {
    const { accepted, rejected } = partitionImageFiles([
      makeFile('a.jpg', 'image/jpeg'),
      makeFile('b.heic', 'image/heic'),
      makeFile('c.png', 'image/png'),
    ]);

    expect(accepted.map(file => file.name)).toEqual(['a.jpg', 'c.png']);
    expect(rejected.map(file => file.name)).toEqual(['b.heic']);
  });

  it('rejects a file with no reported type rather than guessing', () => {
    const { accepted, rejected } = partitionImageFiles([
      makeFile('mystery', ''),
    ]);

    expect(accepted).toEqual([]);
    expect(rejected).toHaveLength(1);
  });

  it('handles an empty drop', () => {
    expect(partitionImageFiles([])).toEqual({ accepted: [], rejected: [] });
  });
});
