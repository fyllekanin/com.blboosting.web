import { Component, HostListener } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/auth/auth.service';
import { SiteNotificationService } from '../../../../core/common-services/site-notification.service';
import { Router } from '@angular/router';
import { SiteNotificationType } from '../../../../shared/app-views/site-notification/site-notification.interface';

@Component({
    selector: 'app-admin-battle-net-connect',
    templateUrl: 'battle-net-connect.component.html',
    styleUrls: ['battle-net-connect.component.scss']
})
export class BattleNetConnectComponent {
    private loginWindow: WindowProxy;

    constructor(
        private siteNotificationService: SiteNotificationService,
        private router: Router,
        private authService: AuthService
    ) {
    }

    onClick(): void {
        this.loginWindow = open(`${environment.server}/api/battle-net/oauth?token=${this.authService.getAccessToken()}`, 'Login', 'height=750,width=400');
        this.loginWindow.focus();
    }

    @HostListener('window:message', ['$event'])
    onPostMessage(data: any) {
        if (data.origin !== environment.server) {
            return;
        }
        const { payload } = data.data;
        if (!payload) {
            return;
        }
        if (payload.isTokenMissing) {
            this.siteNotificationService.create({
                type: SiteNotificationType.ERROR,
                title: 'Error',
                message: 'Token was missing, try logging out and in again'
            })
        } else if (payload.isSuccess) {
            this.siteNotificationService.create({
                type: SiteNotificationType.SUCCESS,
                title: 'Success',
                message: 'Battle.net account connected!'
            });
            this.router.navigateByUrl('/admin');
        }

        this.loginWindow.close();
        this.loginWindow = null;
    }
}
