import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { StaffListModel } from './staff-list.model';
import { HttpService } from '../../../../../core/http/http.service';
import { Observable } from 'rxjs';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class StaffListService implements Resolve<StaffListModel> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(): Observable<StaffListModel> {
        return this.httpService.get('/admin/website-settings/staff-list');
    }

    async save(data: StaffListModel): Promise<void> {
        return this.httpService.put('/admin/website-settings/staff-list', data).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Updated',
                    message: 'Staff list updated',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
            });
    }
}
