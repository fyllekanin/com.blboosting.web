import { Injectable } from '@angular/core';
import { HttpService } from '../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ChangeHabboService {

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async changeHabbo (habbo: string): Promise<boolean> {
        return this.httpService.put('/user/account/change-habbo', {
            habbo: habbo
        }).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'You have changed your habbo!',
                    type: SiteNotificationType.INFO
                });
                return true;
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
                return false;
            });
    }
}
