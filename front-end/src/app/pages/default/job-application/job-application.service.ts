import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from '../../../core/http/http.service';
import { Observable } from 'rxjs';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';
import { JobApplicationModel } from './job-application.model';

@Injectable()
export class JobApplicationService implements Resolve<Array<{ label: string, id: number }>> {

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {

    }

    resolve (): Observable<Array<{ label: string, id: number }>> {
        return this.httpService.get('/page/job-application');
    }

    post (data: JobApplicationModel): Promise<boolean> {
        return this.httpService.post('/page/job-application', data)
            .toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Your job application is submitted!',
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
