import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://qa-task.redvike.rocks/')
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Recruitment Task - Web Form');
});
