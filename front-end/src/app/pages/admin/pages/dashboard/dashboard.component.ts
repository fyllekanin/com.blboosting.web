import { Component } from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {
    avatarUrl: string;

    constructor(authService: AuthService) {
        const authUser = authService.getUser();
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${authUser.discordId}/${authUser.avatarHash}.png?size=32`;
    }
}
