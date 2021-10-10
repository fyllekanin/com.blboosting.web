import { Component } from '@angular/core';
import { TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { ActivatedRoute } from '@angular/router';
import { RolesListEntry } from '../roles.interfaces';
import { ColorValue } from '../../../../../shared/constants/colors.constants';
import { IPagination } from '../../../../../shared/components/pagination/pagination.interface';

@Component({
    selector: 'app-admin-roles-list',
    templateUrl: 'roles-list.component.html',
    styleUrls: ['roles-list.component.css']
})
export class RolesListComponent {
    pagination: IPagination<RolesListEntry>;
    headers: Array<TableHeader> = [
        { label: 'Name' },
        { label: 'Position' }
    ];
    rows: Array<TableRow> = [];

    constructor(activatedRoute: ActivatedRoute) {
        activatedRoute.data.subscribe(this.onData.bind(this));
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
                { label: 'Edit', color: ColorValue.BLUE, value: 'edit', icon: 'fas fa-edit' },
                { label: 'Delete', color: ColorValue.RED, value: 'delete', icon: 'fas fa-trash' }
            ]
        }));
    }
}
