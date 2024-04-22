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
}
