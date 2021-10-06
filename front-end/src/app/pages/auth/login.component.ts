import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

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
        this.loginWindow = open('http://localhost:3000/api/oauth/discord', 'Login', 'height=750,width=400');
        this.loginWindow.focus();
    }

    @HostListener('window:message', ['$event'])
    onPostMessage(data: any) {
        if (data.origin !== 'http://localhost:3000') {
            return;
        }
        const value = data.data;
        if (value.error) {
            this.isNotInGuild = value.error === 1;
            this.isNotAllowedToLogin = value.error === 2;
            return;
        }
        this.loginWindow.close();
        this.loginWindow = null;
        this.authService.setAuthUser(value);
        this.router.navigateByUrl('/admin');
    }
}
