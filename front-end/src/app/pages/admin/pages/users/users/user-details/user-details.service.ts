import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SlimUser } from '../../../../../../shared/classes/slim-user.class';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { SiteNotificationType } from '../../../../../../shared/app-views/site-notification/site-notification.interface';
import { SiteNotificationService } from '../../../../../../core/common-services/site-notification.service';

@Injectable()
export class UserDetailsService implements Resolve<SlimUser> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<SlimUser> {
        return this.httpService.get(`/admin/users/users/${route.params.userId}/details`);
    }

    save(data: { userId: number, username: string, habbo: string, password: string, repassword: string, role: string }): Promise<void> {
        return this.httpService.put(`/admin/users/users/${data.userId}/details`, data).toPromise()
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
