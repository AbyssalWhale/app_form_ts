import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { fa, faker } from '@faker-js/faker';
import { ApplicationSubmissionForm, getApplicationSubmissionData } from '../interfaces/ApplicationSubmissionForm';

let homePage: HomePage;
let applicationSubmissionData: ApplicationSubmissionForm;

test.beforeEach(async ({ page }) => {
  // Arrange
  applicationSubmissionData = getApplicationSubmissionData(
    faker.person.firstName(),
    faker.person.lastName(),
    faker.internet.email(),
    faker.internet.password())
  applicationSubmissionData.passwordConfirmed = applicationSubmissionData.password

  homePage = new HomePage(page)
  await homePage.navigate()
  await expect(await homePage.getTitle(), "Page title is not macthed with expected").toBe(homePage.titleExpected);
});

test.afterAll(async() => {
  await homePage.closePage();
})

test('submission is successful and the data is correctly displayed on the success page', async () => {
  // Act
  await fillRequiredFields(applicationSubmissionData)
  await homePage.unlockSlider();
  let formSubmissionsPage = await homePage.clickSubmit();

  // Assert
  await expect(
      await formSubmissionsPage.isHeaderDisplayed(), 
      "Header is not displayed")
      .toBeTruthy();
  await expect(
      await formSubmissionsPage.getName(), 
      "Expected first and last names are matched with submitted")
      .toBe(applicationSubmissionData.firstName + " " + applicationSubmissionData.lastName);
  await expect(
       await formSubmissionsPage.getEmail(), "Expected email is matched with submitted")
      .toBe(applicationSubmissionData.email);
});

const testCases: [string | null, string | null, string | null, string | null, string | null][] = [
  ["", null, null, null, null],
  [null, "", null, null, null],
  [null, null, "usergmail.com", null, null],
  [null, null, null, "123123123", null],
  [null, null, null, null, "123123123"]
];

testCases.forEach((testCase, index) => {
  const [firstName, lastName, email, pass, passConfirmed] = testCase;
  test(`${index + 1} Application with invalid data can not be submitted: ${firstName}, ${lastName}, ${email}, ${pass}, ${passConfirmed}`, async () => {
    // Arrange
    let passUnderTest = pass === null ? faker.internet.password() : pass;
    let passConfirmedUnderTest = passConfirmed === null ? faker.internet.password() : passConfirmed;
    let dataUnderTest = getApplicationSubmissionData(
      firstName === null ? faker.person.firstName() : firstName, 
      lastName === null ? faker.person.lastName() : lastName, 
      email === null ? faker.internet.email() : email,
      passUnderTest, 
      passConfirmedUnderTest)

      // Act
      await await fillRequiredFields(dataUnderTest)
      await homePage.unlockSlider();
      await homePage.clickSubmit();

      // Assert
      await expect(
        await homePage.getTitle(), 
        `It's expected that application was not sumbitted and the user is still on the page: ${homePage.titleExpected}`)
        .toBe(homePage.titleExpected);

      if (passUnderTest === null || passConfirmedUnderTest === null) {
        await expect(
          await homePage.IsPassNotMatchedErrorDisplayed(), 
          "Expected that error is displayed on the page when passwords are mismatched in submitted application")
          .toBeTruthy()
      }
  });
});

test('Application can not be submit without solved captcha', async() => {
    // Act
    await fillRequiredFields(applicationSubmissionData)
    let formSubmissionsPage = await homePage.clickSubmit();

    // Assert
    await expect(
      await homePage.getTitle(), 
      `It's expected that application was not sumbitted and the user is still on the page: ${homePage.titleExpected}`)
      .toBe(homePage.titleExpected);
    
    await expect(
      await homePage.IsUnsolvedCaptchaErrorDisplayed(), 
      "Expected that captcha error is displayed on the page after sumbitting application with unsolved captcha")
      .toBeTruthy();
});

const fillRequiredFields = async (dataUnderTest: ApplicationSubmissionForm) => {
  await homePage.inputFirstName(dataUnderTest.firstName);
  await homePage.inputLastName(dataUnderTest.lastName);
  await homePage.inputEmail(dataUnderTest.email);
  await homePage.inputPassword(dataUnderTest.password);
  await homePage.inputConfirmPassword(dataUnderTest.passwordConfirmed);
};