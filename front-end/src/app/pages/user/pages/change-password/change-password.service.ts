import { Injectable } from '@angular/core';
import { HttpService } from '../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ChangePasswordService {

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async changePassword (password: string, repassword: string, shouldDeleteTokens: boolean): Promise<void> {
        this.httpService.put('/user/account/change-password', {
            password: password,
            repassword: repassword,
            shouldDeleteTokens: shouldDeleteTokens
        }).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'You have changed your password!',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
            });
    }
}
