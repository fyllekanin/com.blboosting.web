import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    private loginWindow: WindowProxy;

    username: string;

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
            // Not in guild
        }
        if (value.accessToken) {
            this.username = value.username;
        }
        this.loginWindow.close();
        this.loginWindow = null;
    }
}
