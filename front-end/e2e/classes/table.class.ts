import { browser, by, element } from 'protractor';

export class TableClass {

    static isRowWithCellValuePresent (cellIndex: number, value: string) {
        return element(by.cssContainingText(`app-table tr td:nth-child(${cellIndex + 1})`, value)).isPresent();
    }

    static clickTableActionWithCellValue (cellIndex: number, cellValue: string, value: string) {
        const ele = element(by.cssContainingText(`app-table tr td:nth-child(${cellIndex + 1}`, cellValue));
        const rowElement = ele.element(by.xpath('ancestor::tr'));
        const actionEle = rowElement.element(by.css('.actions .action'));
        actionEle.click();
        const action = rowElement.element(by.cssContainingText('.action-list div', value));
        browser.actions().mouseMove(action, { x: 0, y: 0 }).perform();
        action.click();
    }
}
