import { Component } from '@angular/core';
import { TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { ActivatedRoute } from '@angular/router';
import { RolesListEntry } from '../roles.interfaces';

@Component({
    selector: 'app-admin-roles-list',
    templateUrl: 'roles-list.component.html',
    styleUrls: ['roles-list.component.css']
})
export class RolesListComponent {
    headers: Array<TableHeader> = [
        { label: 'Name' },
        { label: 'Position' }
    ];
    rows: Array<TableRow> = [];

    constructor(activatedRoute: ActivatedRoute) {
        activatedRoute.data.subscribe(this.onData.bind(this));
    }

    private onData({ data }: { data: { total: number, page: number, items: Array<RolesListEntry> } }): void {
        this.rows = data.items.map(item => ({
            rowId: item._id,
            cells: [
                { label: item.name },
                { label: item.position }
            ]
        }));
    }
}
