import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})
export class AdminComponent {
    avatarUrl: string;
    name: string;
    amount: string;

    constructor(private authService: AuthService) {
        const authUser = this.authService.getUser();
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${authUser.discordId}/${authUser.avatarHash}.png?size=100`;
        this.name = authUser.username;
        this.amount = '127,342';
    }

    onLogout(): void {
        this.authService.logout();
    }
}
