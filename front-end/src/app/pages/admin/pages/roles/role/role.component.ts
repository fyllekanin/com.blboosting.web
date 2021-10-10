import { Component, OnDestroy } from '@angular/core';
import { RoleEntry } from '../roles.interfaces';
import { ActivatedRoute } from '@angular/router';
import { CombineSubscriptions } from '../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { RoleService } from './role.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthUser } from '../../../../../core/auth/auth.model';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ColorValue } from '../../../../../shared/constants/colors.constants';

@Component({
    selector: 'app-admin-roles-role',
    templateUrl: 'role.component.html',
    styleUrls: ['role.component.css']
})
export class RoleComponent implements OnDestroy {
    entity: RoleEntry;
    user: AuthUser;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    actions: Array<UserAction> = [
        { label: 'Save', color: ColorValue.GREEN, value: 'save' },
        { label: 'Back', color: ColorValue.BLUE, link: '/admin/roles/page/1' }
    ];

    constructor(
        private roleService: RoleService,
        authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.user = authService.getUser();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    private onData({ data }: { data: RoleEntry }): void {
        this.entity = data;
    }
}
