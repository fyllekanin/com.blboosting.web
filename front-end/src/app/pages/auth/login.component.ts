import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    private loginWindow: WindowProxy;

    isNotInGuild = false;
    isNotAllowedToLogin = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    onLogin(): void {
        this.loginWindow = open(`${environment.server}/api/oauth/discord`, 'Login', 'height=750,width=400');
        this.loginWindow.focus();
    }

    @HostListener('window:message', ['$event'])
    onPostMessage(data: any) {
        if (data.origin !== environment.server) {
            return;
        }
        const { payload } = data.data;
        if (!payload) {
            return;
        }

        if (payload.error) {
            this.isNotInGuild = payload.error === 1;
            this.isNotAllowedToLogin = payload.error === 2;
            this.loginWindow.close();
            return;
        }
        this.loginWindow.close();
        this.loginWindow = null;
        this.authService.setAuthUser(payload);
        this.router.navigateByUrl('/admin');
    }
}
