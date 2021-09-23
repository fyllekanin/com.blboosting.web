import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomePageSettingsModel } from './home-page-settings.model';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class HomePageSettingsService implements Resolve<HomePageSettingsModel> {

    constructor(
        private httpClient: HttpClient,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(): Observable<HomePageSettingsModel> {
        return this.httpClient.get<HomePageSettingsModel>('/api/admin/website-settings/home-page-settings');
    }

    async save(data: FormData): Promise<HomePageSettingsModel> {
        return await this.httpClient.post('/api/admin/website-settings/home-page-settings', data)
            .toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Home page settings updated',
                    type: SiteNotificationType.INFO
                });
                return this.httpClient.get('/api/admin/website-settings/home-page-settings')
                    .toPromise();
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
                return null;
            });
    }
}
