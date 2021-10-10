import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { RoleEntry } from '../roles.interfaces';
import { HttpService } from '../../../../../core/http/http.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class RoleService implements Resolve<RoleEntry> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async update(entity: RoleEntry): Promise<void> {
        await this.httpService.put(`/admin/roles/role/${entity._id}`, entity)
            .pipe(map(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Role updated',
                    type: SiteNotificationType.SUCCESS
                });
                return EMPTY;
            }), catchError((_error) => {
                this.siteNotificationService.create({
                    title: 'Ops',
                    message: 'Something went wrong',
                    type: SiteNotificationType.ERROR
                });
                return EMPTY;
            })).toPromise();
    }

    resolve(route: ActivatedRouteSnapshot): Observable<RoleEntry> {
        return this.httpService.get(`/admin/roles/role/${route.params.id}`)
            .pipe(map((data: RoleEntry) => data));
    }
}
