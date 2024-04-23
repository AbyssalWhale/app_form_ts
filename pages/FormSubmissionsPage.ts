import { POMBase } from './PomBase';
import { Locator, Page, expect } from '@playwright/test';

export class FormSubmissionsPage extends POMBase {
    titleExpected: string;
    private readonly titleHeader: Locator;

    constructor(page: Page) {
        super(page); 
        this.titleExpected = "Form Submissions";
        this.titleHeader = this.page.locator("//h1[text()='Successful Form Submissions']")
    }

    async isHeaderDisplayed(){
        return await this.titleHeader.isVisible();
    }

    async getName(){
        return await this.getNameOrEmailValueByLabel("Name");
    }

    async getEmail(){
        return await this.getNameOrEmailValueByLabel("Email");
    }

    private async getNameOrEmailValueByLabel(label: string): Promise<string> {
        const result = await this.page.evaluate((label: string) => {
            const xpath = `//strong[text()='${label}:']/following-sibling::text()[1]`;
            const element = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null).stringValue;
            return element.trim();
        }, label);
    
        return result;
    }
}