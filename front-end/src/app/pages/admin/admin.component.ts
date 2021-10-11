import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthUser } from '../../core/auth/auth.model';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})
export class AdminComponent {
    avatarUrl: string;
    amount: string;
    authUser: AuthUser;

    constructor(private authService: AuthService) {
        this.authUser = this.authService.getUser();
        // this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.authUser.discordId}/${this.authUser.avatarHash}.png?size=100`;
        this.avatarUrl = 'https://cdn.discordapp.com/attachments/769522185978511400/896824758673481770/BetaWeb.png';
        this.amount = '127,342';
    }

    onLogout(): void {
        this.authService.logout();
    }
}
