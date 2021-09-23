import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { UserAction } from '../../../shared/constants/common.interfaces';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';

@Component({
    selector: 'app-auth-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent {
    registerAction: Array<UserAction> = [
        { label: 'Register', value: 'register' }
    ];
    data = {
        username: null,
        password: null,
        repassword: null,
        habbo: null,
        approvesGdpr: false,
        approvesTos: false
    };

    constructor (
        private authService: AuthService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async onRegister (): Promise<void> {
        if (!this.data.approvesTos) {
            this.siteNotificationService.create({
                title: 'Warning',
                message: 'You need to approve the terms of service to signup!',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        if (!this.data.approvesGdpr) {
            this.siteNotificationService.create({
                title: 'Warning',
                message: 'You need to approve the GDPR to signup!',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        await this.authService.doRegister(this.data);
    }
}
