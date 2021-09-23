import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { IPagination, IPaginationResolver } from '../../../../../../shared/components/pagination/pagination.model';
import { DialogService } from '../../../../../../core/common-services/dialog.service';
import { GroupClass } from '../../../../../../shared/classes/admin/group.class';
import { TimeHelper } from '../../../../../../shared/helpers/time.helper';
import { GroupService } from '../group/group.service';
import { SearchablePage } from '../../../../../../shared/classes/searchable-page.class';

@Component({
    selector: 'app-admin-users-group-list',
    templateUrl: 'group-list.component.html'
})
@UnSub()
export class GroupListComponent extends SearchablePage implements OnDestroy {
    private readonly ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete'
    };

    contentActions = [{ label: 'Create new', value: 'createNew' }];
    data: IPagination<GroupClass>;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    params = {
        name: null,
        isExactSearch: false
    };
    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        { label: 'Name' },
        { label: 'Immunity' },
        { label: 'Last Modified' }
    ];

    constructor (
        private groupService: GroupService,
        private dialogService: DialogService,
        protected  router: Router,
        protected activatedRoute: ActivatedRoute
    ) {
        super();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
        this.params.name = activatedRoute.snapshot.queryParams.name;
        this.params.isExactSearch = activatedRoute.snapshot.queryParams.isExactSearch === 'true';
    }

    onAction (response: TableActionResponse): void {
        switch (response.action.value) {
            case this.ACTIONS.EDIT:
                this.router.navigateByUrl(`/admin/users/groups/${response.row.rowId}`);
                break;
            case this.ACTIONS.DELETE:
                this.onDelete(response.row.rowId as number);
                break;
        }
    }

    onCreateNew (): void {
        this.router.navigateByUrl(`/admin/users/groups/new`);
    }

    ngOnDestroy (): void {
        // Empty
    }

    private async onDelete (groupId: number): Promise<void> {
        const confirmed = await this.dialogService.confirm('Do you really wanna delete this group?');
        if (confirmed) {
            await this.groupService.delete(groupId);
            this.rows = this.rows.filter(row => row.rowId !== groupId);
        }
    }

    private onData ({ pagination }: IPaginationResolver<GroupClass>): void {
        this.data = pagination;
        this.rows = this.getRows();
    }

    private getRows (): Array<TableRow> {
        return this.data.items.map(item => ({
            rowId: item.groupId,
            actions: [
                {
                    label: 'Edit',
                    value: this.ACTIONS.EDIT
                },
                {
                    label: 'Delete',
                    value: this.ACTIONS.DELETE
                }
            ],
            cells: [
                { label: item.name },
                { label: item.immunity },
                { label: TimeHelper.getLongDateWithTime(item.createdAt) }
            ]
        }));
    }
}
