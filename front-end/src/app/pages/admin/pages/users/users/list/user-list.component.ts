import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { IPagination, IPaginationResolver } from '../../../../../../shared/components/pagination/pagination.model';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { SlimUser } from '../../../../../../shared/classes/slim-user.class';
import { SearchablePage } from '../../../../../../shared/classes/searchable-page.class';
import { TimeHelper } from "../../../../../../shared/helpers/time.helper";

@Component({
    selector: 'app-admin-users-users-list',
    templateUrl: 'user-list.component.html'
})
@UnSub()
export class UserListComponent extends SearchablePage implements OnDestroy {
    private readonly ACTIONS = {
        EDIT_DETAILS: 'edit_details',
        EDIT_GROUPS: 'edit_groups'
    };

    data: IPagination<SlimUser>;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    params = {
        username: null,
        habbo: null,
        isExactSearch: false
    };
    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        {label: 'Username'},
        {label: 'Habbo'},
        {label: 'Last Modified'}
    ];

    constructor(
        private authService: AuthService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute
    ) {
        super();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
        this.params.username = activatedRoute.snapshot.queryParams.username;
        this.params.habbo = activatedRoute.snapshot.queryParams.habbo;
        this.params.isExactSearch = activatedRoute.snapshot.queryParams.isExactSearch === 'true';
    }

    onAction(response: TableActionResponse): void {
        switch (response.action.value) {
            case this.ACTIONS.EDIT_DETAILS:
                this.router.navigateByUrl(`/admin/users/users/${response.row.rowId}/details`);
                break;
            case this.ACTIONS.EDIT_GROUPS:
                this.router.navigateByUrl(`/admin/users/users/${response.row.rowId}/groups`);
                break;
        }
    }

    ngOnDestroy(): void {
        // Empty
    }

    private onData({pagination}: IPaginationResolver<SlimUser>): void {
        this.data = pagination;
        this.rows = this.getRows();
    }

    private getRows(): Array<TableRow> {
        const adminPermissions = this.authService.getAuthUser().adminPermissions;
        return this.data.items.map(item => ({
            rowId: item.userId,
            actions: [
                {
                    label: 'Edit details',
                    value: this.ACTIONS.EDIT_DETAILS,
                    isHidden: !adminPermissions.CAN_MANAGE_USER_BASICS &&
                        !adminPermissions.CAN_MANAGE_USER_ADVANCED
                },
                {
                    label: 'Edit groups',
                    value: this.ACTIONS.EDIT_GROUPS,
                    isHidden: !adminPermissions.CAN_MANAGE_USER_GROUPS
                }
            ],
            cells: [
                {label: item.username},
                {label: item.habbo},
                {label: TimeHelper.getTime(item.updatedAt)}
            ]
        }));
    }
}
