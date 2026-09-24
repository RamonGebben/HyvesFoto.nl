import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

// A real 2x2 red PNG — big enough that image decoding produces a sane
// naturalWidth/naturalHeight (a 1x1 pixel would make the crop math trivial
// but wouldn't exercise it).
const REDS_2X2_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR42mNk+M9QLzk4GAcNGkQGAB' +
  'YJA/9j2fLBAAAAAElFTkSuQmCC';

const makePngFile = (name: string) => ({
  name,
  mimeType: 'image/png',
  buffer: Buffer.from(REDS_2X2_PNG_BASE64, 'base64'),
});

/** Drags one element onto another with intermediate steps, so dnd-kit's
 * pointer sensor (which needs real movement past its activation distance)
 * actually starts and finishes a drag. */
const dragOnto = async (page: Page, fromLabel: RegExp, toLabel: RegExp) => {
  const from = page.getByRole('button', { name: fromLabel });
  const to = page.getByRole('group', { name: toLabel });

  // On a phone viewport the grid can sit below the fold. Playwright's mouse
  // coordinates are viewport-relative, so make the drop target visible before
  // reading either bounding box and starting the drag.
  await to.scrollIntoViewIfNeeded();
  await expect(from).toBeVisible();
  await expect(to).toBeVisible();

  const fromBox = await from.boundingBox();
  const toBox = await to.boundingBox();
  if (!fromBox || !toBox) throw new Error('Could not locate drag elements.');

  const fromCenter = {
    x: fromBox.x + fromBox.width / 2,
    y: fromBox.y + fromBox.height / 2,
  };
  const toCenter = {
    x: toBox.x + toBox.width / 2,
    y: toBox.y + toBox.height / 2,
  };

  // The mobile project emulates a phone viewport. Chromium otherwise scrolls
  // the page while the pointer crosses the long collage, moving the drop tile
  // away from the pointer before dnd-kit resolves the target.
  await page.evaluate(() => {
    document.documentElement.style.setProperty('overflow', 'hidden');
  });

  await page.mouse.move(fromCenter.x, fromCenter.y);
  await page.mouse.down();
  await page.mouse.move(
    (fromCenter.x + toCenter.x) / 2,
    (fromCenter.y + toCenter.y) / 2,
    { steps: 5 },
  );
  await page.mouse.move(toCenter.x, toCenter.y, { steps: 5 });
  await page.mouse.up();

  await page.evaluate(() => {
    document.documentElement.style.removeProperty('overflow');
  });
};

test.describe('collage editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the editor with the Buzz format selected', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /jouw foto\. jouw uitsnede\. klaar voor Hyves\./i,
      }),
    ).toBeVisible();
  });

  test('accepts a dropped photo and keeps it across a reload', async ({
    page,
  }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([makePngFile('strand.png')]);

    await expect(page.getByRole('img', { name: 'strand.png' })).toBeVisible();

    await page.reload();

    // Restored from IndexedDB rather than re-uploaded.
    await expect(page.getByRole('img', { name: 'strand.png' })).toBeVisible();
  });

  test('rejects a format the canvas cannot decode', async ({ page }) => {
    await page.getByLabel(/kies foto/i).setInputFiles([
      {
        name: 'holiday.heic',
        mimeType: 'image/heic',
        buffer: Buffer.from('not-really-heic'),
      },
    ]);

    // Scoped: Next.js renders its own route announcer with role="alert".
    await expect(
      page.getByRole('alert').filter({ hasText: /kon .* niet lezen/i }),
    ).toContainText(/niet ondersteund/i);
  });

  test('zooms a photo with the scroll wheel', async ({ page }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([makePngFile('strand.png')]);

    const frame = page.getByRole('group', {
      name: /uitsnede van strand\.png/i,
    });
    const image = frame.locator('img');
    await expect(image).toBeVisible();

    const box = await frame.boundingBox();
    if (!box) throw new Error('Could not locate the crop frame.');

    const widthBefore = await image.evaluate(
      el => el.getBoundingClientRect().width,
    );

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -400);

    await expect
      .poll(() => image.evaluate(el => el.getBoundingClientRect().width))
      .toBeGreaterThan(widthBefore);
  });

  test('forms a grid from three photos and exports it', async ({ page }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([
        makePngFile('strand.png'),
        makePngFile('terras.png'),
        makePngFile('festival.png'),
      ]);

    await expect(
      page.getByRole('heading', { name: /jouw collage/i }),
    ).toBeVisible();

    // Every photo gets its own pannable crop frame.
    await expect(
      page.getByRole('group', { name: /uitsnede van strand\.png/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('group', { name: /uitsnede van terras\.png/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('group', { name: /uitsnede van festival\.png/i }),
    ).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /collage exporteren/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('buzz-collage.jpg');
  });

  test('removing a photo takes it out of the grid', async ({ page }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([makePngFile('strand.png')]);

    await expect(
      page.getByRole('group', { name: /uitsnede van strand\.png/i }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: /^verwijder strand\.png$/i })
      .click();

    await expect(
      page.getByRole('heading', { name: /jouw collage/i }),
    ).toHaveCount(0);
  });

  test('offers several layout choices and lets the user switch between them', async ({
    page,
  }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([
        makePngFile('strand.png'),
        makePngFile('terras.png'),
        makePngFile('festival.png'),
      ]);

    const threeColumns = page.getByRole('radio', { name: /3 kolommen/i });
    const threeRows = page.getByRole('radio', { name: /3 rijen/i });

    await expect(threeColumns).toBeChecked();
    await threeRows.click();
    await expect(threeRows).toBeChecked();
  });

  test('lets the user close the gap between tiles down to zero', async ({
    page,
  }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([makePngFile('strand.png'), makePngFile('terras.png')]);

    const gapSlider = page.getByLabel(/randbreedte/i);
    await gapSlider.fill('0');
    await expect(gapSlider).toHaveValue('0');
  });

  test('drags one photo onto another to swap their tiles', async ({ page }) => {
    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([
        makePngFile('strand.png'),
        makePngFile('terras.png'),
        makePngFile('festival.png'),
      ]);

    const images = page.locator('img[alt$=".png"]');
    await expect(images).toHaveCount(3);
    await expect(images.first()).toHaveAttribute('alt', 'strand.png');

    await dragOnto(
      page,
      /versleep strand\.png om van plek te wisselen/i,
      /uitsnede van festival\.png/i,
    );

    // strand.png now sits where festival.png used to be — last in DOM order.
    await expect(images.last()).toHaveAttribute('alt', 'strand.png');
  });

  test('replaces the upload screen with the editor once photos are added, and Begin opnieuw resets it', async ({
    page,
  }) => {
    await expect(page.getByText(/sleep je foto’s hierheen/i)).toBeVisible();

    await page
      .getByLabel(/kies foto/i)
      .setInputFiles([makePngFile('strand.png')]);

    await expect(
      page.getByRole('heading', { name: /jouw collage/i }),
    ).toBeVisible();
    await expect(page.getByText(/sleep je foto’s hierheen/i)).toHaveCount(0);

    await page.getByRole('button', { name: /begin opnieuw/i }).click();

    await expect(
      page.getByRole('heading', { name: /jouw collage/i }),
    ).toHaveCount(0);
    await expect(page.getByText(/sleep je foto’s hierheen/i)).toBeVisible();
  });
});
