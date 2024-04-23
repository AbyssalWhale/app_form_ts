import { POMBase } from './pom_base';
import { Page, expect } from '@playwright/test';

export class HomePage extends POMBase {
    title_expected: string;
    constructor(page: Page) {
        super(page); 
        this.title_expected = 'Recruitment Task - Web Form'
    }

    async navigate(){
        await this.page.goto('https://qa-task.redvike.rocks/');
        const is_title_matched = await this.isCurrentTitleMatchedWithExpected()
        await expect(is_title_matched).toBeTruthy();
    }

    async inputFirstName(value: string){
        await this.page.fill("input[name='first_name']", value)
    }

    async inputLastName(value: string){
        await this.page.fill("input[name='last_name']", value)
    }

    async inputEmail(value: string){
        await this.page.fill("input[name='email']", value)
    }

    async inputPassword(value: string){
        await this.page.fill("input[name='password']", value)
    }

    async inputConfirmPassword(value: string){
        await this.page.fill("input[name='confirm_password']", value)
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
        await this.page.click("input[value='Submit']")
    }
}
