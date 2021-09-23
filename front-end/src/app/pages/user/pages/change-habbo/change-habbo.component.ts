import { Component } from '@angular/core';
import { UserAction } from '../../../../shared/constants/common.interfaces';
import { ChangeHabboService } from './change-habbo.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-user-change-habbo',
    templateUrl: 'change-habbo.component.html'
})
export class ChangeHabboComponent {
    habbo: string;
    userId: number;
    currentHabbo: string;
    contentActions: Array<UserAction> = [
        { label: 'Save', value: 'save' }
    ];

    constructor (
        private authService: AuthService,
        private service: ChangeHabboService
    ) {
        this.userId = this.authService.getAuthUser().userId;
        this.currentHabbo = this.authService.getAuthUser().habbo;
    }

    async onSave (): Promise<void> {
        const result = await this.service.changeHabbo(this.habbo);
        if (result) {
            this.authService.getAuthUser().habbo = this.habbo;
            this.currentHabbo = this.habbo;
            this.habbo = '';
        }
    }
}
