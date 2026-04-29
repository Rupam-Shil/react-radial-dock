import { test, expect } from '@playwright/test';

test('right-click → hover → click → select', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('instructions')).toBeVisible();
  await expect(page.locator('[role="menu"]')).toHaveCount(0);

  // Right-click in the page body, away from text.
  await page.mouse.move(400, 300);
  await page.mouse.click(400, 300, { button: 'right' });
  await expect(page.locator('[role="menu"]')).toBeVisible();

  // Move cursor up (toward slice 0 — top by default), then click.
  await page.mouse.move(400, 220);
  const slice0 = page.locator('path.rrd-slice').first();
  await expect(slice0).toBeVisible();
  await slice0.click();

  // Menu should close.
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  // Last selected should be set.
  await expect(page.getByTestId('last')).not.toHaveText('—');
});

test('Escape closes the dock', async ({ page }) => {
  await page.goto('/');
  await page.mouse.click(400, 300, { button: 'right' });
  await expect(page.locator('[role="menu"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
});

test('hotkey opens the dock at last cursor', async ({ page }) => {
  await page.goto('/');
  await page.mouse.move(500, 400);
  // Mac vs non-Mac — Playwright runs Linux/Mac in CI; test both with `Meta`+e and `Control`+e.
  // Page reports navigator.platform; we just press Control+E since the example app's hotkey is "mod+e"
  // which resolves to Cmd on Mac / Ctrl elsewhere. Playwright's default headless Chromium runs on Linux,
  // so Control+E is the right one.
  await page.keyboard.press('Control+E');
  await expect(page.locator('[role="menu"]')).toBeVisible();
});
