import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/http/http.service';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { Router } from '@angular/router';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ForgotPasswordService {

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService,
        private router: Router
    ) {
    }

    async getTimestamp (username: string): Promise<{ habbo: string, timestamp: number }> {
        return this.httpService.get(`/auth/forgotten-password/${username}`).toPromise()
            .then(data => data as { habbo: string, timestamp: number });
    }

    async performForgottenPassword (username: string, password: string, repassword: string): Promise<void> {
        this.httpService.post('/auth/forgotten-password', {
            username: username,
            password: password,
            repassword: repassword
        }).toPromise()
            .then(async () => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Password is updated!',
                    type: SiteNotificationType.INFO
                });
                await this.router.navigateByUrl('/auth/login');
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }
}
