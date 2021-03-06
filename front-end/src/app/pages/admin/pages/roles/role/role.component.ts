import { Component, OnDestroy } from '@angular/core';
import { RoleEntry } from '../roles.interfaces';
import { ActivatedRoute } from '@angular/router';
import { CombineSubscriptions } from '../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { RoleService } from './role.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthUser } from '../../../../../core/auth/auth.model';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ButtonClasses } from '../../../../../shared/constants/button.constants';

@Component({
    selector: 'app-admin-roles-role',
    templateUrl: 'role.component.html',
    styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnDestroy {
    entity: RoleEntry;
    user: AuthUser;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    actions: Array<UserAction> = [
        { label: 'Save', buttonClass: ButtonClasses.GREEN, value: 'save' },
        { label: 'Back', buttonClass: ButtonClasses.BLUE, link: '/admin/roles/page/1' }
    ];

    constructor(
        private roleService: RoleService,
        authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.user = authService.getUser();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    async onAction(action: UserAction): Promise<void> {
        if (action.value === 'save') {
            await this.roleService.update(this.entity);
        }
    }

    ngOnDestroy(): void {
        // Empty
    }

    private onData({ data }: { data: RoleEntry }): void {
        this.entity = data;
    }
}
