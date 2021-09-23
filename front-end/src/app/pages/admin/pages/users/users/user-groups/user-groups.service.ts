import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { UserGroupsModel } from './user-groups.model';
import { SiteNotificationType } from '../../../../../../shared/app-views/site-notification/site-notification.interface';
import { SiteNotificationService } from '../../../../../../core/common-services/site-notification.service';

@Injectable()
export class UserGroupsService implements Resolve<UserGroupsModel> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<UserGroupsModel> {
        return this.httpService.get<UserGroupsModel>(`/admin/users/users/${route.params.userId}/groups`);
    }

    save(data: UserGroupsModel): Promise<void> {
        return this.httpService.put(`/admin/users/users/${data.userId}/groups`, data).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Updated',
                    message: 'User updated',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
            });
    }
}
