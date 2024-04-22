import { Page } from '@playwright/test';

export abstract class POMBase {
    protected page: Page;
    abstract title_expected: string;

    constructor(page: Page) {
        this.page = page
    }

    async getTitle() {
        return await this.page.title();
    }

    async isCurrentTitleMatchedWithExpected(){
        return await this.getTitle() == this.title_expected;
    }

    async closePage(){
        await this.page.close()
    }
}