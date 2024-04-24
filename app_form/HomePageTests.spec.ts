import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { faker } from '@faker-js/faker';
import { ApplicationSubmissionForm, getApplicationSubmissionData, getGeneratedApplicationSubmissionData } from '../interfaces/ApplicationSubmissionForm';
import * as path from 'path';
import { getRootDirectory, getDownloadDir } from '../utils/SysUtils';
import { FormSubmissionsPage } from '../pages/FormSubmissionsPage';

let homePage: HomePage;
let applicationSubmissionData: ApplicationSubmissionForm;
let projectDirPath: string;
let downloadDirPath: string;

test.beforeAll(async({}) => {
  projectDirPath = getRootDirectory();
  downloadDirPath = getDownloadDir();
})

test.beforeEach(async ({ page }) => {
  // Arrange
  applicationSubmissionData = getGeneratedApplicationSubmissionData()
  
  homePage = new HomePage(page)
  await homePage.navigate()
  await expect(
    await homePage.getTitle(), "Page title is not macthed with expected")
    .toBe(homePage.titleExpected);
});

test.afterAll(async() => {
  await homePage.closePage();
})

test('submission is successful and the data is correctly displayed on the success page', async () => {
  // Act
  await homePage.fillRequiredFields(applicationSubmissionData)
  let formSubmissionsPage = await homePage.solveCaptchaAndClickSubmit();

  // Assert
  await assertNavigationToSubmissionPage(formSubmissionsPage)
  await expect(
      await formSubmissionsPage.getName(), "Expected first and last names are matched with submitted")
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
      await homePage.fillRequiredFields(dataUnderTest)
      await homePage.solveCaptchaAndClickSubmit();

      // Assert
      await expect(
        await homePage.getTitle(), `It's expected that application was not sumbitted and the user is still on the page: ${homePage.titleExpected}`)
        .toBe(homePage.titleExpected);

      if (passUnderTest === null || passConfirmedUnderTest === null) {
        await expect(
          await homePage.IsPassNotMatchedErrorDisplayed(), "Expected that error is displayed on the page when passwords are mismatched in submitted application")
          .toBeTruthy()
      }
  });
});

test('Application can not be submit without solved captcha', async() => {
    // Act
    await homePage.fillRequiredFields(applicationSubmissionData);
    await homePage.clickSubmit();

    // Assert
    await expect(
      await homePage.getTitle(), `It's expected that application was not sumbitted and the user is still on the page: ${homePage.titleExpected}`)
      .toBe(homePage.titleExpected);
    
    await expect(
      await homePage.IsUnsolvedCaptchaErrorDisplayed(), "Expected that captcha error is displayed on the page after sumbitting application with unsolved captcha")
      .toBeTruthy();
});

const avatarTestCase = ["avatar_large.jpg", "avatar_mid.jpg", "avatar_smal.jpg"]
avatarTestCase.forEach((avatar, index) =>{
  test(`${index + 1} ${avatar} can be uploaded with application form`, async () => {
    // Arrange
    let avatarPath = path.join(projectDirPath, 'test_data', avatar);

    // Act
    await homePage.fillRequiredFields(applicationSubmissionData)
    await homePage.attachAvatar(avatarPath)
    let formSubmissionsPage = await homePage.solveCaptchaAndClickSubmit();

    // Assert
    await assertNavigationToSubmissionPage(formSubmissionsPage)
    await expect(
      await formSubmissionsPage.isAvatarMatched(downloadDirPath, avatarPath), `It's expected that uploaded avatar on the page: ${formSubmissionsPage.titleExpected} is identical to submitted avatar`)
      .toBeTruthy()
  });
})

async function assertNavigationToSubmissionPage(page: FormSubmissionsPage) {
  await expect(
    await page.getTitle(), `It's expected the user was forwarded to the ${page.titleExpected} after application sumbission`)
    .toBe(page.titleExpected);
  await expect(
    await page.isHeaderDisplayed(), "Header is not displayed")
    .toBeTruthy();
}