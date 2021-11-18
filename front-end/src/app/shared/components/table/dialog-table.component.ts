import { Component } from '@angular/core';
import { IPagination } from '../pagination/pagination.interface';
import { TableActionResponse, TableHeader, TableRow } from './table.model';

@Component({
    selector: 'app-dialog-table',
    templateUrl: 'dialog-table.component.html'
})
export class DialogTableComponent<T> {
    pagination: IPagination<T>;
    headers: Array<TableHeader> = [];
    rows: Array<TableRow> = [];
    search: string;

    onSearchChange: (page: number) => void;
    onPageChange: (page: number) => void;
    onSelectRow: (rowId: number | string) => void;

    onAction(action: TableActionResponse): void {
        this.onSelectRow(action.row.rowId);
    }
}
