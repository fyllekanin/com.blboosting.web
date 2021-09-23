import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from '../../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { RadioSettingsClass } from '../../../../../shared/classes/radio-settings.class';
import { Observable } from 'rxjs';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class RadioSettingsService implements Resolve<RadioSettingsClass> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(): Observable<RadioSettingsClass> {
        return this.httpService.get<RadioSettingsClass>('/admin/website-settings/radio-settings');
    }

    async save(data: RadioSettingsClass): Promise<void> {
        return this.httpService.put('/admin/website-settings/radio-settings', data).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Updated',
                    message: 'Radio settings updated',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
            });
    }
}
