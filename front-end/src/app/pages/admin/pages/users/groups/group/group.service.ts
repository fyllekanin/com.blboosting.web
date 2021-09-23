import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../../shared/app-views/site-notification/site-notification.interface';
import { GroupClass } from '../../../../../../shared/classes/admin/group.class';

@Injectable()
export class GroupService implements Resolve<GroupClass> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<GroupClass> {
        if (route.params.groupId === 'new') {
            return of({} as GroupClass);
        }
        return this.httpService.get<GroupClass>(`/admin/users/groups/${route.params.groupId}`);
    }

    async delete(groupId: number): Promise<void> {
        return this.httpService.delete(`/admin/users/groups/${groupId}`).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Group deleted',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(() => {
                this.siteNotificationService.create({
                    title: 'Opss',
                    message: 'Something went wrong',
                    type: SiteNotificationType.ERROR
                });
                throw new Error();
            });
    }

    async save(group: GroupClass): Promise<number | unknown> {
        if (group.groupId) {
            return this.httpService.put(`/admin/users/groups/${group.groupId}`, group).toPromise()
                .then(() => {
                    this.siteNotificationService.create({
                        title: 'Updated',
                        message: 'Group updated',
                        type: SiteNotificationType.INFO
                    });
                    return group.groupId;
                })
                .catch(error => {
                    this.siteNotificationService.onError(error.error);
                });
        } else {
            return this.httpService.post('/admin/users/groups', group).toPromise()
                .then(groupId => {
                    this.siteNotificationService.create({
                        title: 'Created',
                        message: 'Group created',
                        type: SiteNotificationType.INFO
                    });
                    return groupId;
                })
                .catch(error => {
                    this.siteNotificationService.onError(error.error);
                });
        }
    }
}
