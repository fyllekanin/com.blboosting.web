import { browser, by, element, protractor } from 'protractor';

export class InputClass {

    static setTextOnId (id: string, text: string): void {
        const ele = element(by.css(`input[id="${id}"]`));
        browser.wait(protractor.ExpectedConditions.presenceOf(ele), 5000, `Input ${id} is not present`);
        ele.clear();
        ele.sendKeys(text);
    }
}
