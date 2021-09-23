import { Component } from '@angular/core';
import { ForgotPasswordService } from './forgot-password.service';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';
import { UserAction } from '../../../shared/constants/common.interfaces';

@Component({
    selector: 'app-auth-forgotten-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.css']
})
export class ForgotPasswordComponent {
    data = {
        username: null,
        password: null,
        repassword: null
    };

    timestamp: { habbo: string, timestamp: number };
    username: string;
    nextAction: Array<UserAction> = [
        { label: 'Next', value: 'next' }
    ];
    performAction: Array<UserAction> = [
        { label: 'Perform', value: 'perform' }
    ];

    constructor (
        private service: ForgotPasswordService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async onNext (): Promise<void> {
        const timestamp = await this.service.getTimestamp(this.username);
        if (!timestamp) {
            this.siteNotificationService.create({
                title: 'No user found',
                message: 'No user found with that username',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        this.timestamp = timestamp;
        this.data.username = this.username;
    }

    async onPermform (): Promise<void> {
        await this.service.performForgottenPassword(this.data.username, this.data.password, this.data.repassword);
    }
}
