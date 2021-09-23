import { browser } from 'protractor';
import { AuthClass } from '../../classes/auth.class';
import { ClickClass } from '../../classes/click.class';
import { InputClass } from '../../classes/input.class';
import { TableClass } from '../../classes/table.class';
import { IdHelper } from '../../../../back-end/src/helpers/id.helper';

describe('Group', () => {

    beforeEach(() => {
        browser.get('/');
        AuthClass.login('admin', 'test1234');
        AuthClass.goToAdmin();
    });

    afterEach(() => {
        browser.executeScript('window.localStorage.clear();');
    });

    function createGroup (setup: { name: string, displayName: string, immunity: string }) {
        InputClass.setTextOnId('name', setup.name);
        InputClass.setTextOnId('displayName', setup.displayName);
        InputClass.setTextOnId('immunity', setup.immunity);

        ClickClass.clickContentAction('Save');
        ClickClass.clickContentAction('Go back');
    }

    it('should be possible to create a usergroup', () => {
        const name = `${IdHelper.newUuid()}-name`;
        const displayName = `${IdHelper.newUuid()}-displayName`;
        ClickClass.clickLinkWithText('Manage Groups');
        ClickClass.clickContentAction('Create new');

        createGroup({ name: name, displayName: displayName, immunity: '50' });

        expect(TableClass.isRowWithCellValuePresent(0, name)).toBeTruthy();
    });

    it('should be possible to delete a group', () => {
        const name = `${IdHelper.newUuid()}-name`;
        const displayName = `${IdHelper.newUuid()}-displayName`;
        ClickClass.clickLinkWithText('Manage Groups');
        ClickClass.clickContentAction('Create new');

        createGroup({ name: name, displayName: displayName, immunity: '50' });
        expect(TableClass.isRowWithCellValuePresent(0, name)).toBeTruthy();

        TableClass.clickTableActionWithCellValue(0, name, 'Edit');
        ClickClass.clickContentAction('Delete');
        ClickClass.clickDialogAction('Yes');

        expect(TableClass.isRowWithCellValuePresent(0, name)).toBeFalsy();
    });

    it('should be possible to update a group', () => {
        const name = `${IdHelper.newUuid()}-name`;
        const displayName = `${IdHelper.newUuid()}-displayName`;
        ClickClass.clickLinkWithText('Manage Groups');
        ClickClass.clickContentAction('Create new');

        createGroup({ name: name, displayName: displayName, immunity: '50' });
        expect(TableClass.isRowWithCellValuePresent(0, name)).toBeTruthy();

        TableClass.clickTableActionWithCellValue(0, name, 'Edit');
        const newName = `${IdHelper.newUuid()}-name`;
        ClickClass.clickContentAction('Save');
        ClickClass.clickContentAction('Go back');

        expect(TableClass.isRowWithCellValuePresent(0, name)).toBeFalsy();
        expect(TableClass.isRowWithCellValuePresent(0, newName)).toBeTruthy();
    });
});
