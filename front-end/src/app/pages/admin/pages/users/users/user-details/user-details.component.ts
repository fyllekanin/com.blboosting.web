import { Component, OnDestroy } from '@angular/core';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { UserDetailsService } from './user-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAction } from '../../../../../../shared/constants/common.interfaces';
import { AuthService } from '../../../../../../core/auth/auth.service';

@Component({
    selector: 'app-admin-users-users-details',
    templateUrl: 'user-details.component.html'
})
@UnSub()
export class UserDetailsComponent implements OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        GO_BACK: 'go_back'
    };

    data = {
        userId: 0,
        username: '',
        habbo: '',
        password: '',
        repassword: '',
        role: ''
    };
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    canEditAdvanced = false;
    contentActions: Array<UserAction> = [
        { label: 'Save', value: this.ACTIONS.SAVE },
        { label: 'Go back', value: this.ACTIONS.GO_BACK }
    ];

    constructor (
        private service: UserDetailsService,
        private authService: AuthService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(data => {
            this.data.userId = data.data.userId;
            this.data.username = data.data.username;
            this.data.habbo = data.data.habbo;
            this.data.role = data.data.role;
        });
        this.canEditAdvanced = this.authService.getAuthUser().adminPermissions.CAN_MANAGE_USER_ADVANCED;
    }

    async onAction (action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.SAVE:
                await this.service.save(this.data);
                break;
            case this.ACTIONS.GO_BACK:
                this.router.navigateByUrl('/admin/users/users/page/1');
                break;
        }
    }

    ngOnDestroy (): void {
        // Empty
    }
}
