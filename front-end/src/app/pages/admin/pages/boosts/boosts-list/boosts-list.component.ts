import { Component } from '@angular/core';
import { TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { IPagination } from '../../../../../shared/components/pagination/pagination.interface';
import { RolesListEntry } from '../../roles/roles.interfaces';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ButtonClasses } from '../../../../../shared/constants/button.constants';

@Component({
    selector: 'app-admin-boosts-list',
    templateUrl: 'boosts-list.component.html',
    styleUrls: ['boosts-list.component.scss'],
})
export class BoostsListComponent {
    rows: Array<TableRow> = [{
        rowId: 0,
        cells: [
            { label: 'Under construction' }
        ]
    }];
    pagination: IPagination<RolesListEntry>;
    headers: Array<TableHeader> = [
        { label: 'Name' }
    ];
    actions: Array<UserAction> = [{
        label: 'Create',
        buttonClass: ButtonClasses.BLUE,
        link: '/admin/boosts/boost/new'
    }];
}
