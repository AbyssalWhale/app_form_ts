import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home_page';
import { faker } from '@faker-js/faker';


let homePage: HomePage;
let firstName: string;
let lastName: string;
let email: string;
let password: string;
let passwordConfirm: string;

test.beforeEach(async ({ page }) => {
  firstName = faker.person.firstName();
  lastName = faker.person.lastName();
  email = faker.internet.email();
  password = faker.internet.password();
  passwordConfirm = password;

  homePage = new HomePage(page)
  await homePage.navigate()
});

test.afterAll(async() => {
  homePage.closePage()
})

test('has title', async ({ page }) => {
  const title_current = await homePage.getTitle() 
  await expect(title_current).toBe('Recruitment Task - Web Form');

  await homePage.inputFirstName(firstName)
  await homePage.inputLastName(lastName)
  await homePage.inputEmail(email)
  await homePage.inputPassword(password)
  await homePage.inputConfirmPassword(passwordConfirm)
  await homePage.unlockSlider()
  await homePage.clickSubmit()
});