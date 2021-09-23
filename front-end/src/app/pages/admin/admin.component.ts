import { Component } from '@angular/core';
import { ISideMenu } from '../../shared/components/side-menu/side-menu.interface';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})
export class AdminComponent {
    menus: Array<ISideMenu> = [];

    constructor (authService: AuthService) {
        const user = authService.getAuthUser();

        this.menus = [
            {
                title: 'General',
                items: [
                    {
                        label: 'Dashboard',
                        url: '/admin',
                        icon: 'fas fa-home',
                        isApplicable: true
                    },
                    {
                        label: 'Website Settings',
                        url: '/admin/website-settings/list',
                        icon: 'fas fa-home',
                        isApplicable: user.adminPermissions.CAN_MANAGE_STAFF_LIST
                    }
                ]
            },
            {
                title: 'User management',
                items: [
                    {
                        label: 'Manage Groups',
                        url: `/admin/users/groups/page/1`,
                        icon: 'fas fa-table',
                        isApplicable: user.adminPermissions.CAN_MANAGE_GROUPS
                    },
                    {
                        label: 'Manage Users',
                        url: `/admin/users/users/page/1`,
                        icon: 'fas fa-table',
                        isApplicable: user.adminPermissions.CAN_MANAGE_USER_BASICS ||
                            user.adminPermissions.CAN_MANAGE_USER_GROUPS
                    }
                ]
            }
        ];
    }
}
