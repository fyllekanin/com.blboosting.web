import { browser, by, element, ExpectedConditions } from 'protractor';

export class ClickClass {

    static clickButtonWithId (id: string): void {
        const ele = element(by.css(`button[id="${id}"]`));
        browser.wait(ExpectedConditions.elementToBeClickable(ele), 5000, `Button ${id} is not clickable`);
        ele.click();
    }

    static clickLinkWithText (text: string): void {
        const ele = element(by.cssContainingText(`a`, text));
        browser.wait(ExpectedConditions.elementToBeClickable(ele), 5000, `Link ${text} is not clickable`);
        ele.click();
    }

    static clickContentAction (text: string): void {
        const ele = element(by.cssContainingText(`app-content .actions span`, text));
        browser.wait(ExpectedConditions.elementToBeClickable(ele), 5000, `Action ${text} is not clickable`);
        ele.click();
    }

    static clickDialogAction (text: string): void {
        const ele = element(by.cssContainingText('app-dialog .buttons button', text));
        browser.wait(ExpectedConditions.elementToBeClickable(ele), 5000, `Dialog button ${text} is not clickable`);
        ele.click();
    }
}
