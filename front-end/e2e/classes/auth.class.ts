import { browser, by, element } from 'protractor';
import { ClickClass } from './click.class';
import { InputClass } from './input.class';

export class AuthClass {

    static isLoggedIn () {
        return element(by.css('app-navigation .logged-in-icon')).isPresent();
    }

    static login (username: string, password: string) {
        ClickClass.clickButtonWithId('top-login-button');
        InputClass.setTextOnId('username', username);
        InputClass.setTextOnId('password', password);
        ClickClass.clickButtonWithId('login');
    }

    static goToAdmin () {
        const ele = element(by.css('.logged-in-icon .fa-user'));
        browser.actions().mouseMove(ele).perform();
        ClickClass.clickLinkWithText('AdminCP');
    }
}
