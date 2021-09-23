import { Component } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-website-settings-list',
    templateUrl: 'website-settings-list.component.html'
})
export class WebsiteSettingsListComponent {
    private readonly possibleSettings: Array<{ name: string, description: string, permissions: Array<string>, url: string }> = [
        {
            name: 'Staff list',
            description: 'Add, remove or re-order groups on the staff list',
            permissions: ['CAN_MANAGE_STAFF_LIST'],
            url: '/admin/website-settings/staff-list'
        },
        {
            name: 'Radio settings',
            description: 'Update the radio settings used for the radio',
            permissions: ['CAN_MANAGE_RADIO_SETTINGS'],
            url: '/admin/website-settings/radio-settings'
        },
        {
            name: 'Bbcodes',
            description: 'Create, edit or delete bbcodes in the system',
            permissions: ['CAN_MANAGE_BBCODES'],
            url: '/admin/website-settings/bbcodes'
        },
        {
            name: 'Home Page',
            description: 'Edit banner, spotlight etc',
            permissions: ['CAN_MANAGE_HOME_PAGE'],
            url: '/admin/website-settings/home-page-settings'
        }
    ];

    headers: Array<TableHeader> = [
        { label: 'Name' },
        { label: 'Description' }
    ];
    rows: Array<TableRow> = [];

    constructor (
        private router: Router,
        authService: AuthService
    ) {
        const adminPermissions = authService.getAuthUser().adminPermissions;
        this.rows = this.possibleSettings
            .filter(setting => setting.permissions.every(permission => adminPermissions[permission]))
            .map(setting => ({
                rowId: setting.name,
                cells: [
                    { label: setting.name },
                    { label: setting.description }
                ],
                actions: [
                    {
                        label: 'Manage',
                        value: 'manage'
                    }
                ]
            }));
    }

    onAction (action: TableActionResponse): void {
        const setting = this.possibleSettings.find(item => item.name === action.row.rowId);
        this.router.navigateByUrl(setting.url);
    }
}
