import { Component } from '@angular/core';
import { UserAction } from '../../../../shared/constants/common.interfaces';
import { ChangePasswordService } from './change-password.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-user-change-password',
    templateUrl: 'change-password.component.html'
})
export class ChangePasswordComponent {
    password: string;
    repassword: string;
    shouldDeleteTokens: boolean;

    userId: number;
    contentActions: Array<UserAction> = [
        { label: 'Save', value: 'save' }
    ];

    constructor (
        private service: ChangePasswordService,
        authService: AuthService
    ) {
        this.userId = authService.getAuthUser().userId;
    }

    async onSave (): Promise<void> {
        await this.service.changePassword(this.password, this.repassword, this.shouldDeleteTokens);
    }
}
