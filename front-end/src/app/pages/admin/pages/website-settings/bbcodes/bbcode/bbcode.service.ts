import { SiteNotificationService } from './../../../../../../core/common-services/site-notification.service';
import { HttpService } from './../../../../../../core/http/http.service';
import { Observable, of } from 'rxjs';
import { BbcodeClass } from './../../../../../../shared/classes/bbcode.class';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { SiteNotificationType } from 'src/app/shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class BbcodeService implements Resolve<BbcodeClass> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<BbcodeClass> {
        const bbcodeId = route.params.bbcodeId;
        if (bbcodeId === 'new') {
            return of({} as BbcodeClass);
        }
        return this.httpService.get<BbcodeClass>(`/admin/website-settings/bbcodes/${bbcodeId}`);
    }

    async create(bbcode: BbcodeClass): Promise<number | unknown> {
        return this.httpService.post(`/admin/website-settings/bbcodes`, bbcode).toPromise()
            .then(bbcodeId => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Bbcode created',
                    type: SiteNotificationType.INFO
                });
                return bbcodeId;
            }).catch(error => this.siteNotificationService.onError(error.error));
    }

    async update(bbcode: BbcodeClass): Promise<void> {
        return this.httpService.put(`/admin/website-settings/bbcodes/${bbcode.bbcodeId}`, bbcode).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Bbcode updated',
                    type: SiteNotificationType.INFO
                });
            }).catch(error => this.siteNotificationService.onError(error.error));
    }

    async delete(bbcodeId: number): Promise<void> {
        return this.httpService.delete(`/admin/website-settings/bbcodes/${bbcodeId}`).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Bbcode deleted',
                    type: SiteNotificationType.INFO
                });
            }).catch(error => this.siteNotificationService.onError(error.error));
    }
}
