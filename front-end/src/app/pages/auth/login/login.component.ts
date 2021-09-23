import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAction } from '../../../shared/constants/common.interfaces';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';

@Component({
    selector: 'app-auth-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    private readonly ACTIONS = {
        LOGIN: 'login',
        REGISTER: 'register',
        FORGOT_PASSWORD: 'forgot-password'
    };

    username: string;
    password: string;

    wasLoginFailed = false;
    contentActions: Array<UserAction> = [
        { label: 'Login', value: this.ACTIONS.LOGIN },
        { label: 'Register', value: this.ACTIONS.REGISTER },
        { label: 'Forgot password', value: this.ACTIONS.FORGOT_PASSWORD }
    ];

    constructor (
        private authService: AuthService,
        private router: Router,
        private siteNotificationService: SiteNotificationService,
        private activatedRoute: ActivatedRoute) {
    }

    async onAction (action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.LOGIN:
                this.onLogin();
                break;
            case this.ACTIONS.REGISTER:
                await this.router.navigateByUrl('/auth/register');
                break;
            case this.ACTIONS.FORGOT_PASSWORD:
                await this.router.navigateByUrl('/auth/forgot-password');
                break;
        }
    }

    onLogin (): void {
        this.authService.doLogin(this.username, this.password).then(result => {
            if (result) {
                const path = this.activatedRoute.snapshot.queryParams.path ?
                    decodeURIComponent(this.activatedRoute.snapshot.queryParams.path) : '/';
                this.router.navigateByUrl(path);
            } else {
                this.siteNotificationService.create({
                    title: 'Error',
                    message: 'Incorrect username or password',
                    type: SiteNotificationType.ERROR
                });
            }
        });
    }
}
