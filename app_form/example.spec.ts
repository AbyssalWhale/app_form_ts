import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home_page';

let home_page: HomePage;

test.beforeEach(async ({ page }) => {
  //await page.goto('https://qa-task.redvike.rocks/')
  home_page = new HomePage(page)
  await home_page.navigate()
});

test.afterAll(async() => {
  home_page.closePage()
})

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Recruitment Task - Web Form');
});