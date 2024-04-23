import { Page } from '@playwright/test';

export abstract class POMBase {
    protected page: Page;
    abstract titleExpected: string;

    constructor(page: Page) {
        this.page = page
    }

    async getTitle() {
        return await this.page.title();
    }

    async isCurrentTitleMatchedWithExpected(){
        return await this.getTitle() == this.titleExpected;
    }

    async closePage(){
        await this.page.close()
    }
}