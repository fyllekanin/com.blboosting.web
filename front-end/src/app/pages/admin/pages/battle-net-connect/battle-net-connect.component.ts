import { Component, HostListener } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-admin-battle-net-connect',
    templateUrl: 'battle-net-connect.component.html',
    styleUrls: ['battle-net-connect.component.scss']
})
export class BattleNetConnectComponent {
    private loginWindow: WindowProxy;

    constructor(private authService: AuthService) {
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
        debugger;
        this.loginWindow.close();
        this.loginWindow = null;
    }
}
