import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { faker } from '@faker-js/faker';


let homePage: HomePage;
let firstName: string;
let lastName: string;
let email: string;
let password: string;
let passwordConfirm: string;

test.beforeEach(async ({ page }) => {
  // Arrange
  firstName = faker.person.firstName();
  lastName = faker.person.lastName();
  email = faker.internet.email();
  password = faker.internet.password();
  passwordConfirm = password;

  homePage = new HomePage(page)
  await homePage.navigate()
});

test.afterAll(async() => {
  await homePage.closePage();
})

test('submission is successful and the data is correctly displayed on the success page', async () => {
  // Act
  await expect(await homePage.getTitle()).toBe(homePage.titleExpected);
  await homePage.inputFirstName(firstName);
  await homePage.inputLastName(lastName);
  await homePage.inputEmail(email);
  await homePage.inputPassword(password);
  await homePage.inputConfirmPassword(passwordConfirm);
  await homePage.unlockSlider();
  let formSubmissionsPage = await homePage.clickSubmit();

  // Assert
  await expect(await formSubmissionsPage.isHeaderDisplayed(), "Header is not displayed").toBeTruthy();
  await expect(await formSubmissionsPage.getName(), "Expected first and last names are matched with submitted").toBe(firstName + " " + lastName);
  await expect(await formSubmissionsPage.getEmail(), "Expected email is matched with submitted").toBe(email);
});