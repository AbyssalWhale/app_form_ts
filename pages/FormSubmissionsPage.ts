import { POMBase } from './PomBase';
import { Locator, Page, expect } from '@playwright/test';
import axios from 'axios';
import fs from 'fs/promises';
import * as path from 'path';
import * as Jimp from 'jimp';

export class FormSubmissionsPage extends POMBase {
    titleExpected: string;
    private readonly titleHeader: Locator;
    private readonly avatarImage: Locator;

    constructor(page: Page) {
        super(page); 
        this.titleExpected = "Form Submissions";
        this.titleHeader = this.page.locator("//h1[text()='Successful Form Submissions']")
        this.avatarImage = this.page.locator("img[alt='Avatar']")
    }

    async isAvatarMatched(downloadPath: string, pathToExpectedAvatar: string){
        let downloadURL = await this.getAvatarDownloadURL()
        const pathToActualAvatar = path.join(
            downloadPath, 
            `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}.jpg`)
        await this.downloadAvatar(downloadURL, pathToActualAvatar)
        let result = await this.AreImagesidentical(pathToActualAvatar, pathToExpectedAvatar)
        return result
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

    private async downloadAvatar(url: string, donwloadPath: string){
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const fileData = Buffer.from(response.data, 'binary');
            await fs.writeFile(donwloadPath, fileData);
            console.log('file saved!');
        } catch (err) {
            throw new Error(`Error during donwloading avatar. URL ${url}`);
        }
    }

    private async getAvatarDownloadURL(){
        let hrefAttributeValue = await this.avatarImage.getAttribute("src")
        if(hrefAttributeValue != null){
            let downloadURL = `${this.page.url()}${hrefAttributeValue}`; 
            downloadURL = downloadURL.replace("/success", "");
            return downloadURL;
        } else {
            throw new Error(`Avatar tag is missing src attribute. Unable to create download URL`);
        }
    }

    private async AreImagesidentical(path1: string, path2: string){
        const image1 = await Jimp.read(path1);
        const image2 = await Jimp.read(path2);
        
        // Compare images pixel by pixel
        const diff = Jimp.diff(image1, image2);

        // Check if images are identical
        return diff.percent === 0;
    }
}