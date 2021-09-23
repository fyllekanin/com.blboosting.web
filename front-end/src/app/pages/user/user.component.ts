import { Component } from '@angular/core';
import { ISideMenu } from '../../shared/components/side-menu/side-menu.interface';

@Component({
    selector: 'app-user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})
export class UserComponent {
    menus: Array<ISideMenu> = [];

    constructor () {
        this.menus = [
            {
                title: 'Account',
                items: [
                    {
                        label: 'Overview',
                        url: '/user',
                        icon: 'fas fa-home',
                        isApplicable: true
                    },
                    {
                        label: 'Change Password',
                        url: '/user/change-password',
                        icon: 'fas fa-home',
                        isApplicable: true
                    },
                    {
                        label: 'Change Habbo',
                        url: '/user/change-habbo',
                        icon: 'fas fa-home',
                        isApplicable: true
                    }
                ]
            },
            {
                title: 'Essentials',
                items: [
                    {
                        label: 'Name Settings',
                        url: ``,
                        icon: 'fas fa-table',
                        isApplicable: true
                    }
                ]
            }
        ];
    }
}
