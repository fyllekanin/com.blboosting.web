import { Component, OnDestroy } from '@angular/core';
import {
    TableActionResponse,
    TableFilters,
    TableHeader,
    TableRow
} from '../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesListEntry } from '../roles.interfaces';
import { ButtonClasses } from '../../../../../shared/constants/button.constants';
import { IPagination } from '../../../../../shared/components/pagination/pagination.interface';
import { CombineSubscriptions, UnSub } from '../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';

@Component({
    selector: 'app-admin-roles-list',
    templateUrl: 'roles-list.component.html',
    styleUrls: ['roles-list.component.scss']
})
@UnSub()
export class RolesListComponent implements OnDestroy {
    pagination: IPagination<RolesListEntry>;
    headers: Array<TableHeader> = [
        { label: 'Name' },
        { label: 'Position' }
    ];
    rows: Array<TableRow> = [];
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    filters: TableFilters = {
        path: '/admin/roles/page/1',
        filters: [{
            placeholder: 'Name',
            queryName: 'name',
            type: 'string'
        }]
    };

    constructor(
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    onAction(action: TableActionResponse): void {
        if (action.action.value === 'edit') {
            this.router.navigate([`/admin/roles/role/${action.row.rowId}`]);
        }
    }

    private onData({ data }: { data: IPagination<RolesListEntry> }): void {
        this.pagination = data;
        this.rows = data.items.map(item => ({
            rowId: item._id,
            cells: [
                { label: item.name },
                { label: item.position }
            ],
            actions: [
                { label: 'Edit', buttonClass: ButtonClasses.BLUE, value: 'edit', icon: 'fas fa-edit' }
            ]
        }));
    }
}
