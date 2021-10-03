import { Component } from '@angular/core';
import { TableHeader, TableRow } from '../../../../../shared/components/table/table.model';

@Component({
    selector: 'app-admin-roles-list',
    templateUrl: 'roles-list.component.html',
    styleUrls: ['roles-list.component.css']
})
export class RolesListComponent {
    headers: Array<TableHeader> = [
        {label: 'Name'},
        {label: 'Position'}
    ];
    rows: Array<TableRow> = [
        {
            rowId: '1',
            cells: [
                {label: 'Plate'},
                {label: '53'}
            ],
            actions: [
                {label: 'Test', value: 'test'}
            ]
        },
        {
            rowId: '1',
            cells: [
                {label: 'Plate'},
                {label: '53'}
            ],
            actions: [
                {label: 'Test', value: 'test'}
            ]
        }
    ];
}
