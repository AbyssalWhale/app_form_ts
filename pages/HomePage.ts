import { FormSubmissionsPage } from './FormSubmissionsPage';
import { POMBase } from './PomBase';
import { Locator, Page, expect } from '@playwright/test';

export class HomePage extends POMBase {
    titleExpected: string;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailNameInput: Locator;
    private readonly passInput: Locator;
    private readonly passConfirmInput: Locator;
    private readonly submitButton: Locator;
    private readonly passwordNotMatchedError: Locator;
    private readonly captchaNotSolvedError: Locator;

    constructor(page: Page) {
        super(page); 
        this.titleExpected = 'Recruitment Task - Web Form';
        this.firstNameInput = page.locator("input[name='first_name']");
        this.lastNameInput = page.locator("input[name='last_name']");
        this.emailNameInput = page.locator("input[name='email']");
        this.passInput = page.locator("input[name='password']");
        this.passConfirmInput = page.locator("input[name='confirm_password']");
        this.submitButton = page.locator("input[value='Submit']");
        this.passwordNotMatchedError = page.locator("//li[text()='Passwords do not match!']");
        this.captchaNotSolvedError = page.locator("//li[text()='Please solve the captcha!']");
    }

    async navigate(){
        await this.page.goto('https://qa-task.redvike.rocks/', { waitUntil: 'domcontentloaded' });
        const is_title_matched = await this.isCurrentTitleMatchedWithExpected()
        await expect(is_title_matched).toBeTruthy();
    }

    async IsUnsolvedCaptchaErrorDisplayed(){
        return await this.captchaNotSolvedError.isVisible()
    }

    async IsPassNotMatchedErrorDisplayed(){
        return await this.passwordNotMatchedError.isVisible()
    }

    async inputFirstName(value: string){
        await this.firstNameInput.fill(value)
    }

    async inputLastName(value: string){
        await this.lastNameInput.fill(value)
    }

    async inputEmail(value: string){
        await this.emailNameInput.fill(value)
    }

    async inputPassword(value: string){
        await this.passInput.fill(value)
    }

    async inputConfirmPassword(value: string){
        await this.passConfirmInput.fill(value)
    }

    async unlockSlider(){
        const element = await this.page.waitForSelector('form[method="POST"]');
        await this.page.evaluate((form) => {
            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'hidden');
            inputElement.setAttribute('id', 'captcha_solved');
            inputElement.setAttribute('name', 'captcha_solved');
            inputElement.setAttribute('value', 'true');
            form.appendChild(inputElement);
        }, element);
    }

    async clickSubmit(){
        await this.submitButton.click()
        return new FormSubmissionsPage(this.page)
    }
}
