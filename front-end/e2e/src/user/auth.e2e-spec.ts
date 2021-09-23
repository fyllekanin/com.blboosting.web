import { browser } from 'protractor';
import { AuthClass } from '../../classes/auth.class';

describe('Auth', () => {

    beforeEach(() => {
        browser.get('/');
    });

    afterEach(() => {
        browser.executeScript('window.localStorage.clear();');
    });

    it('should be possible to login', () => {
        AuthClass.login('admin', 'test1234');
        expect(AuthClass.isLoggedIn()).toBeTruthy();
    });
});
