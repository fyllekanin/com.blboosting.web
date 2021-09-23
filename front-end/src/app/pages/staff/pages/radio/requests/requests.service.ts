import { SiteNotificationService } from './../../../../../core/common-services/site-notification.service';
import { Observable } from 'rxjs';
import { HttpService } from './../../../../../core/http/http.service';
import { Resolve } from '@angular/router';
import { RadioRequest } from './requests.model';
import { Injectable } from '@angular/core';
import { SiteNotificationType } from 'src/app/shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class RequestsService implements Resolve<Array<RadioRequest>> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }


    resolve(): Observable<Array<RadioRequest>> {
        return this.httpService.get('/staff/radio/requests');
    }

    async delete(radioRequestId: number): Promise<void> {
        return this.httpService.delete(`/staff/radio/requests/${radioRequestId}`).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Radio request deleted',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }
}
