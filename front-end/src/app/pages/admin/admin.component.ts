import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthUser } from '../../core/auth/auth.model';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent {
    avatarUrl: string;
    amount: string;
    authUser: AuthUser;

    isCollapsed = true;

    navigationItems = [
        {
            icon: 'fa fa-home',
            label: 'Dashboard',
            route: '/admin'
        },
        {
            icon: 'fa fa-cog',
            label: 'Battle.Net',
            route: '/admin/battle-net'
        },
        {
            icon: 'fas fa-running',
            label: 'Mythic+ Boost',
            route: '/admin/boosts/page/1',
            permission: 'CAN_CREATE_BOOST'
        },
        {
            icon: 'fas fa-user-tag',
            label: 'Manage Roles',
            route: '/admin/roles/page/1',
            permission: 'CAN_MANAGE_ROLES'
        }
    ];

    constructor(private authService: AuthService) {
        this.authUser = this.authService.getUser();
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.authUser.discordId}/${this.authUser.avatarHash}.png?size=100`;
        this.navigationItems = this.navigationItems.filter(item => !item.permission || authService.getUser().permissions[item.permission])
    }

    onLogout(): void {
        this.authService.logout();
    }
}
